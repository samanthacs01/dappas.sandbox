package migrations

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upUpdateStoreProcedureToAddUserId, downUpdateStoreProcedureToAddUserId)
}

func upUpdateStoreProcedureToAddUserId(ctx context.Context, tx *sql.Tx) error {
	if err := updateStoreProcedureAcceptInvoiceToAddUserId(tx); err != nil {
		return err
	}
	if err := updateStoreProcedureRecalculateBillToAddUserId(tx); err != nil {
		return err
	}
	if err := updateStoreProcedureRecalculateGenerateBillToAddUserId(tx); err != nil {
		return err
	}
	if err := updateStoreProcedurePaymentBillToAddUserId(tx); err != nil {
		return err
	}
	if err := updateStoreProcedurePaymentInvoiceToAddUserId(tx); err != nil {
		return err
	}
	return nil
}

func downUpdateStoreProcedureToAddUserId(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}

func updateStoreProcedureAcceptInvoiceToAddUserId(tx *sql.Tx) error {
	if _, err := tx.Exec(`drop function if exists accept_invoice(p_ids INTEGER[], p_status text);`); err != nil {
		fmt.Println("Error dropping function accept_invoice", err)
		return err
	}
	_, err := tx.Exec(`
		CREATE OR REPLACE FUNCTION accept_invoice(
			p_ids INTEGER[],
			p_status text,
			p_user_id integer
		)  
		RETURNS TABLE (
			invoice_id INTEGER,
			payer text,
			amount numeric(10,4),
			payment_terms int,
			due_date date
		) AS $$
		DECLARE
			inv_id INTEGER;
			p_next_identifier text;
			inv RECORD;
			iit record;
			b_id integer;
			b_due_date date;
			b_ii_amount numeric;
			b_amount numeric;
			b_revenue numeric;
			b_deduction numeric;
			b_retention numeric;
		BEGIN
			RAISE NOTICE 'Starting';
			FOREACH inv_id IN ARRAY p_ids
			LOOP 
				WITH cte_payers AS (
					SELECT
						DISTINCT MAX(i.identifier) OVER (PARTITION BY p.id) AS identifier,
						p.identifier AS payer_identifier,
						p.payment_terms,
						p.id AS payer_id,
						CASE 
							WHEN i.identifier = 'DRAFT' THEN 0 
							ELSE CAST(SUBSTRING(i.identifier FROM 9) AS INTEGER) 
						END AS number_part
					FROM
						invoices i 
					INNER JOIN payers p ON i.payer_id = p.id
				),
				cte_next_payer_inv_number AS (
					SELECT
						p.payer_id, p.payment_terms,
						'INV-' || p.payer_identifier || '-' || LPAD(COALESCE(MAX(number_part) + 1, 1)::TEXT, 4, '0') AS next_identifier
					FROM cte_payers p
					WHERE p.payer_id in (SELECT payer_id FROM invoices WHERE id = inv_id)
					GROUP BY p.payer_id, p.payer_identifier, p.payment_terms
				)
				SELECT DISTINCT i.id, n.next_identifier, n.payment_terms INTO inv 
				FROM invoices i 
				INNER JOIN cte_next_payer_inv_number n ON i.payer_id = n.payer_id
				WHERE i.id = inv_id
				LIMIT 1;
		
				RAISE NOTICE 'INVOICE % %', inv.id, inv.next_identifier;
				
				UPDATE invoices
				SET status = p_status, 
					identifier = case when identifier = 'DRAFT' then inv.next_identifier else identifier end, 
					invoiced_date = CURRENT_DATE,
					due_date = CURRENT_DATE + (inv.payment_terms||' day')::interval,
					updated_at = (now() AT TIME ZONE 'utc'::text),
					change_by = p_user_id::text
				WHERE id = inv_id;
		
				for iit in 
						WITH 
						cte_collection_productions as (
							select p.id, 
							array_agg(ii.id) over(partition by ii.invoice_id, p.id) as bills, 
						p.identifier, p.net_payment_terms as payment_terms, true as is_billing, p.production_split as split, p.production_expense_discount_type as discount_type
							from productions p inner join invoice_items ii on p.id = ii.production_id where lower(p.production_billing_type) = 'billing'
							AND ii.invoice_id = inv_id
						),
						cte_billing_productions as (
							select distinct p.id, array[ii.id] as bills, p.identifier, p.net_payment_terms as payment_terms, false as is_billing, p.production_split as split,
							p.production_expense_discount_type as discount_type
							from productions p inner join invoice_items ii on p.id = ii.production_id where lower(p.production_billing_type) = 'collection'
							AND ii.invoice_id = inv_id
						)
					SELECT p.id, p.bills, p.identifier, p.payment_terms, is_billing, split, discount_type from cte_collection_productions p
					UNION 
					SELECT p.id, p.bills, p.identifier, p.payment_terms, is_billing, split, discount_type from cte_billing_productions p
		
				LOOP 
					b_due_date := CURRENT_DATE + (iit.payment_terms||' day')::interval;
				
					IF iit.is_billing THEN
						SELECT id INTO b_id FROM bills b WHERE b.production_id = iit.id and date_part('month', b.due_date) = date_part('month', b_due_date) AND date_part('year', b.due_date) = date_part('year', b_due_date)
						LIMIT 1;	
						IF b_id IS NULL THEN
							INSERT INTO bills(invoice_id, production_id, identifier, amount, balance, due_date, change_by)
							VALUES(inv.id, iit.id, bill_next_identifier(iit.id), 0, 0, (date_trunc('month', b_due_date) + INTERVAL '1 month' - INTERVAL '1 day')::date, p_user_id::text)
							returning id into b_id;
		
						end if;
		
					ELSE  
						INSERT INTO bills(invoice_id, production_id, identifier, amount, balance, due_date, change_by)
							VALUES(inv.id, iit.id, bill_next_identifier(iit.id), 0, 0, null, p_user_id::text)
							returning id into b_id;
		
					END IF;
		
					RAISE NOTICE 'NEXT Production Bill % to %', b_id, iit.bills;
		
					UPDATE invoice_items 
					SET bill_id = b_id, 
						updated_at = (now() at time Zone 'utc'::text),
						due_date = b_due_date,
						change_by = p_user_id::text
					where id = any(iit.bills);
		
					UPDATE flights SET status = 'invoiced', change_by = p_user_id::text
						FROM (
							SELECT flight_id from invoice_items WHERE id =any(iit.bills)
						) as _ii 
						WHERE id = _ii.flight_id;
					
					SELECT SUM(ii.amount) into b_ii_amount FROM invoice_items ii WHERE ii.bill_id = b_id;
					if iit.is_billing then 
						SELECT SUM(e.total_deduction) into b_deduction FROM expenses e WHERE e.production_id = iit.id and e.deleted_at is null
							AND CAST(e.month as INTEGER) = date_part('month', b_due_date) 
							AND CAST(e.year as INTEGER) = date_part('year', b_due_date);
					else 
						b_deduction := (SELECT SUM(e.total_deduction) FROM expenses e WHERE e.production_id = iit.id  and e.deleted_at is null
							AND CAST(e.month as INTEGER) = date_part('month', b_due_date) 
							AND CAST(e.year as INTEGER) = date_part('year', b_due_date)) 
							- (SELECT SUM(b.retention) FROM bills b JOIN productions p on b.production_id = p.id and b.deleted_at is null
								WHERE lower(p.production_billing_type) = 'collection' AND  date_part('month', b.due_date)  = date_part('month', b_due_date) 
								AND date_part('year', b.due_date) = date_part('year', b_due_date));
					end if;
					if b_deduction is null then 
						b_deduction := 0;
					end if;
					
					b_amount := b_ii_amount * iit.split / 100;
					if b_amount is null then 
					b_amount := 0;
					end if; 
					b_revenue := case when iit.discount_type ilike 'before%' then (b_ii_amount - b_deduction) * iit.split / 100 else b_amount - b_deduction end;
					b_retention := case when iit.discount_type ilike 'before%' then b_amount - (b_ii_amount - b_deduction) * iit.split / 100 else b_deduction end;
					UPDATE bills SET
						amount = case when b_amount is null then 0 else b_amount::numeric(10,2) end,
						revenue = case when b_revenue is null or b_revenue < 0 then 0 else b_revenue::numeric(10,2) end,
						balance = case when b_revenue is null or b_revenue < 0 then 0 else b_revenue::numeric(10,2) end,
						retention = case when b_retention is null then 0 else b_retention::numeric(10,2) end,
						change_by = p_user_id::text
					WHERE id = b_id;
				END LOOP;
		
				IF not exists (select 1 from flights f inner join invoice_items ii on f.id = ii.invoice_id WHERE f.status <> 'invoiced') then
					UPDATE insertion_orders SET status = 'invoiced', change_by = p_user_id::text 
					FROM (SELECT insertion_order_id FROM invoices WHERE id = inv.id) as i
					WHERE id = i.insertion_order_id;
			
				else 
					if exists(select 1 from insertion_orders io inner join invoices i on io.id = i.insertion_order_id where i.id = inv.id and io.status = 'pending') then
						UPDATE insertion_orders SET status = 'partial_invoiced', change_by = p_user_id::text 
						FROM (SELECT insertion_order_id FROM invoices WHERE id = inv.id) as i
						WHERE id = i.insertion_order_id;
					end if;	
				end if;	
			END LOOP;
		END;
		$$ LANGUAGE plpgsql;
	`)
	if err != nil {
		fmt.Println("Error creating function accept_invoice", err)
	}
	return err
}

func updateStoreProcedureRecalculateBillToAddUserId(tx *sql.Tx) error {
	if _, err := tx.Exec(`drop FUNCTION if exists recalculate_with_expenses(p_production_id INTEGER, p_month text, p_year text) `); err != nil {
		fmt.Println("Error dropping function recalculate_bill", err)
		return err
	}
	_, err := tx.Exec(`CREATE OR REPLACE FUNCTION recalculate_with_expenses(
		p_production_id INTEGER,
		p_month text,
		p_year text,
		p_user_id integer
	)  
	RETURNS void as
	$$
	DECLARE
		_id INTEGER;
		_bill record;
		_deduction numeric;
		_amount numeric;
		_revenue numeric;
		_retention numeric;
		_ii_amount numeric;
		_doc record;
	BEGIN
		RAISE NOTICE 'Starting to recalculate expense';
		
		-- has billing
		for _bill in select b.*,p.production_split as split, p.production_expense_discount_type as discount_type from bills b join productions p ON b.production_id = p.id
			where b.production_id = p_production_id and b.status = 'pending'
			and due_date is not null and date_part('month', b.due_date) = cast(p_month as integer) AND date_part('year', b.due_date) = cast(p_year as integer)
		LOOP
			raise notice 're-calculating bill %', _bill;
			SELECT SUM(ii.amount) into _ii_amount FROM invoice_items ii WHERE ii.bill_id = _bill.id;
			-- IS billing production
			IF exists(select 1 from productions p where p.id = p_production_id AND production_billing_type = 'billing') THEN
				raise notice 'calculating pending expenses from billing prod of %/%', date_part('month', _bill.due_date), date_part('year', _bill.due_date);
				SELECT SUM(e.total_deduction) into _deduction 
				FROM expenses e 
				WHERE e.production_id = p_production_id and e.deleted_at is null
				AND CAST(e.month as INTEGER) = date_part('month', _bill.due_date) 
				AND CAST(e.year as INTEGER) = date_part('year', _bill.due_date);

		
			ELSE 
			raise notice 'calculating pending expenses from collection prod of %/%', date_part('month', _bill.due_date), date_part('year', _bill.due_date);
			_deduction := (SELECT SUM(e.total_deduction) FROM expenses e WHERE e.production_id = p_production_id and e.deleted_at is null
						AND CAST(e.month as INTEGER) = date_part('month', _bill.due_date) 
						AND CAST(e.year as INTEGER) = date_part('year', _bill.due_date)) 
						- (SELECT SUM(b.retention) FROM bills b JOIN productions p on b.production_id = p.id and p.id = p_production_id
							WHERE  date_part('month', b.due_date)  = date_part('month', _bill.due_date) 
							AND date_part('year', b.due_date) = date_part('year', _bill.due_date));
		
			END IF;
				if _deduction is null then 
					_deduction := 0;
				end if;
				
				raise notice 're-calculating add deduction %', _deduction;
				_amount := _ii_amount * _bill.split / 100;
				if _amount is null then 
				_amount := 0;
				end if; 
				_revenue := case when _bill.discount_type ilike 'before%' then (_ii_amount - _deduction) * _bill.split / 100 else _amount - _deduction end;
				_retention := case when _bill.discount_type ilike 'before%' then _amount - (_ii_amount - _deduction) * _bill.split / 100 else _deduction end;
				UPDATE bills SET
					amount = case when _amount is null then 0 else _amount::numeric(10,2) end,
					revenue = case when _revenue is null or _revenue < 0 then 0 else _revenue::numeric(10,2) end,
					balance = case when _revenue is null or _revenue < 0 then 0 else _revenue::numeric(10,2) end,
					retention = case when _retention is null then 0 else _retention::numeric(10,2) end,
					change_by = p_user_id::text
				WHERE id = _bill.id;
		end loop;
	END;
	$$ LANGUAGE plpgsql;
	`)
	if err != nil {
		fmt.Println("Error creating function recalculate_with_expenses", err)
	}
	return err
}

func updateStoreProcedureRecalculateGenerateBillToAddUserId(tx *sql.Tx) error {
	if _, err := tx.Exec(`drop FUNCTION if exists generate_invoice(p_flight_ids INTEGER[]) `); err != nil {
		fmt.Println("Error dropping function generate_bill", err)
		return err
	}
	_, err := tx.Exec(`CREATE OR REPLACE FUNCTION generate_invoice(
			p_flight_ids INTEGER[],
			p_user_id integer
		)
		RETURNS TABLE (
			invoice_id INTEGER,
			payer text,
			amount numeric(10,4),
			payment_terms int,
			due_date date
		) AS $$
			DECLARE
				inv_id INTEGER;
				existing_inv_id INTEGER;
				io RECORD;
				fg RECORD;
			BEGIN
				RAISE NOTICE 'Starting';

				FOR io IN 
					SELECT DISTINCT i.id, array_agg(f.id) over (partition by i.id) as flights, y.payment_terms, sum(f.total_cost) over(partition by i.id) as amount, y.id as payer_id
					FROM insertion_orders i 
					INNER JOIN flights f ON f.insertion_order_id = i.id
					INNER JOIN payers y ON i.payer_id = y.id
					WHERE f.id = ANY(p_flight_ids)

				LOOP 
					RAISE NOTICE 'Processing Insertion Order: %, Flights: %, Amount: %, Payment Terms: %', 
							io.id, io.flights, io.amount, io.payment_terms;             
					SELECT i.id INTO existing_inv_id 
					FROM invoices i
					WHERE i.insertion_order_id = io.id
					AND i.id IN (
					    SELECT ii.invoice_id 
					    FROM invoice_items ii 
					    WHERE ii.flight_id = ANY(io.flights)
					)
					AND i.status = 'draft' LIMIT 1;
					IF existing_inv_id IS NOT NULL THEN
						inv_id := existing_inv_id;
						RAISE NOTICE 'Using existing draft invoice id: %', inv_id;
						UPDATE invoices SET due_date = CURRENT_DATE + (io.payment_terms || ' day')::INTERVAL, invoiced_date = CURRENT_DATE, change_by = p_user_id::text
						WHERE id = inv_id;
					ELSE
						INSERT INTO invoices (identifier, due_date, invoiced_date, insertion_order_id, amount, balance, status, payer_id, change_by)
						VALUES ('DRAFT', CURRENT_DATE + (io.payment_terms || ' day')::INTERVAL, CURRENT_DATE, io.id, io.amount, io.amount, 'draft', io.payer_id, p_user_id::text)
						RETURNING id INTO inv_id;
						RAISE NOTICE 'Created new draft invoice id: %', inv_id;
					END IF;

					FOR fg IN
						SELECT f.id, f.total_cost, f.production_id FROM flights f WHERE f.id =any(io.flights)
					LOOP
							
						IF EXISTS(SELECT 1 FROM invoice_items it WHERE it.flight_id = fg.id AND it.status = 'draft' AND it.invoice_id <> inv_id) THEN
							RAISE NOTICE 'Updating invoices items';
							UPDATE invoice_items i SET invoice_id = inv_id, change_by = p_user_id::text 
							WHERE i.flight_id = fg.id
							AND i.status = 'draft' 
							AND NOT EXISTS (
							    SELECT 1 
							    FROM invoice_items ii 
							    WHERE ii.flight_id = i.flight_id AND ii.invoice_id = inv_id
							);
						ELSE
 							IF NOT EXISTS(SELECT 1 FROM invoice_items it WHERE it.flight_id = fg.id AND it.status = 'draft' AND it.invoice_id = inv_id) THEN
								RAISE NOTICE 'Continue add new items';
								INSERT INTO invoice_items (invoice_id, flight_id, amount, production_id, change_by)
								VaLUES(inv_id, fg.id, fg.total_cost, fg.production_id, p_user_id::text);
							END IF;
						END IF; 
						RAISE NOTICE 'Continue add new items';	
					END LOOP;

					RAISE NOTICE 'CLEAR DATA does not % in %', inv_id, io.flights;
					DELETE FROM invoice_items ii WHERE ii.invoice_id = inv_id AND ii.status = 'draft' AND ii.id not in (select ii2.id from invoice_items ii2 WHERE ii2.flight_id =any(io.flights));
					DELETE FROM invoices i WHERE i.id NOT IN (SELECT ii.invoice_id FROM invoice_items ii) AND i.insertion_order_id = io.id;

				END LOOP;

				RAISE NOTICE 'Return DATA';

				RETURN QUERY 
				SELECT DISTINCT i.id as invoice_id, p.entity_name::text as payer, i.amount, p.payment_terms, i.due_date 
				FROM invoices i 
				INNER JOIN payers p ON i.payer_id = p.id
				INNER JOIn invoice_items f ON i.id = f.invoice_id	
				WHERE f.flight_id = ANY(p_flight_ids);
			END;
		$$ LANGUAGE plpgsql;`)
	if err != nil {
		fmt.Println("Error creating function generate_invoice", err)
	}
	return err
}

func updateStoreProcedurePaymentBillToAddUserId(tx *sql.Tx) error {
	if _, err := tx.Exec(`DROP FUNCTION if exists payment_bill(int4, numeric);`); err != nil {
		fmt.Println("Error dropping function payment_bill", err)
		return err
	}
	_, err := tx.Exec(`CREATE OR REPLACE FUNCTION payment_bill(p_id integer, p_amount numeric, p_user_id integer)
		RETURNS void
		LANGUAGE plpgsql
		AS $function$
				DECLARE 
					st text;
					pt integer;
					b_deduction numeric;
					b_amount numeric;
					b_revenue numeric;
					b_retention numeric;
					bb record;
				BEGIN
					RAISE NOTICE 'Starting';
					insert into bill_payments(bill_id, amount, change_by)
					values (p_id, p_amount, p_user_id::text);
					
					update bills 
						set status = case when balance - p_amount > 0 then 'partial_paid' else 'paid' end,
							balance = case when balance - p_amount > 0 then balance - p_amount else 0 end,
							user_id = p_user_id::text
					where id = p_id;

				END;
				$function$
		;`)
	if err != nil {
		fmt.Println("Error creating function payment_bill", err)
	}
	return err
}

func updateStoreProcedurePaymentInvoiceToAddUserId(tx *sql.Tx) error {
	if _, err := tx.Exec(`DROP FUNCTION if exists payment_invoice(p_id integer, p_amount numeric);`); err != nil {
		fmt.Println("Error dropping function payment_bill", err)
		return err
	}
	_, err := tx.Exec(`CREATE OR REPLACE FUNCTION payment_invoice(p_id integer, p_amount numeric, p_user_id integer)
		RETURNS void
		LANGUAGE plpgsql
		AS $function$
				DECLARE 
					st text;
					pt integer;
					b_deduction numeric;
					b_amount numeric;
					b_revenue numeric;
					b_retention numeric;
					bb record;
				BEGIN
					RAISE NOTICE 'Starting';
					insert into invoice_payments(invoice_id, amount, change_by)
					values (p_id, p_amount, p_user_id::text);
					
					update invoices 
						set status = case when balance - p_amount > 0 then 'partial_paid' else 'paid' end,
							balance = balance - p_amount,
							change_by = p_user_id::text 
					where id = p_id;

					select status::text into st
					from invoices where id = p_id;

					if st = 'paid' then
						for bb in select distinct b.identifier, p.id, ii.bill_id, ii.amount, p.production_expense_discount_type as discount_type, p.production_split as split, net_payment_terms 
							from invoice_items ii 
							inner join productions p on ii.production_id = p.id 
							inner join bills b on ii.bill_id = b.id 
							where ii.invoice_id = p_id and p.production_billing_type = 'collection'
							order by b.identifier desc
						LOOP 
						b_deduction := (SELECT SUM(e.total_deduction) FROM expenses e WHERE e.production_id = bb.id and e.deleted_at is null
							AND CAST(e.month as INTEGER) = date_part('month', CURRENT_DATE + INTERVAL '1 day' * bb.net_payment_terms) 
							AND CAST(e.year as INTEGER) = date_part('year', CURRENT_DATE + INTERVAL '1 day' * bb.net_payment_terms)) 
							- (SELECT SUM(b.retention) FROM bills b JOIN productions p on b.production_id = p.id and b.deleted_at is null
								WHERE p.production_billing_type = 'collection' AND  date_part('month', b.due_date)  = date_part('month', CURRENT_DATE + INTERVAL '1 day' * bb.net_payment_terms) 
								AND date_part('year', b.due_date) = date_part('year', CURRENT_DATE + INTERVAL '1 day' * bb.net_payment_terms));
						if b_deduction is null then 
								b_deduction := 0;
						end if;
							
							b_amount := bb.amount * bb.split / 100;
							if b_amount is null then 
							b_amount := 0;
							end if; 
							b_revenue := case when bb.discount_type ilike 'before%' then (bb.amount - b_deduction) * bb.split / 100 else b_amount - b_deduction end;
							b_retention := case when bb.discount_type ilike 'before%' then b_amount - (bb.amount - b_deduction) * bb.split / 100 else b_deduction end;
							UPDATE bills b SET
								revenue = case when b_revenue is null or b_revenue < 0 then 0 else b_revenue end,
								balance = case when b_revenue is null or b_revenue < 0 then 0 else b_revenue end,
								retention = case when b_retention is null then 0 else b_retention end,
								due_date = CURRENT_DATE + INTERVAL '1 day' * bb.net_payment_terms,
								change_by = p_user_id::text
							WHERE b.id = bb.bill_id;
						
						END LOOP;
					end if; 

				END;
				$function$;`)
	if err != nil {
		fmt.Println("Error creating function payment_bill", err)
	}
	return err
}
