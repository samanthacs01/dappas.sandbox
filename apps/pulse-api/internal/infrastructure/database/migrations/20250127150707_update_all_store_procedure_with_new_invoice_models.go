package migrations

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upUpdateAllStoreProcedureWithNewInvoiceModels, downUpdateAllStoreProcedureWithNewInvoiceModels)
}

func upUpdateAllStoreProcedureWithNewInvoiceModels(ctx context.Context, tx *sql.Tx) error {
	if err := updateStoreProcedureGenerateBillToRemoveInvoiceItems(tx); err != nil {
		return err
	}
	if err := updateStoreProcedureAcceptInvoiceWithNewInvoicesModels(tx); err != nil {
		return err
	}
	if err := updateStoreProcedureRecalculateBillWithNewInvoicesModel(tx); err != nil {
		return err
	}
	if err := updateStoreProcedurePaymentInvoiceToNewInvoicesModel(tx); err != nil {
		return err
	}
	if err := updateStoreProcedurePayablesKPIWithNewInvoiceModel(tx); err != nil {
		return err
	}
	if err := updateStoreProcedurePaymentInvoiceToNewInvoicesModel(tx); err != nil {
		return err
	}
	queryDDL := `
			DO $$
			BEGIN
				IF EXISTS (
					SELECT 1
					FROM pg_tables
					WHERE schemaname = 'public'
					AND tablename = 'invoice_items'
				) THEN
					UPDATE flights f
					SET invoice_id = ii1.invoice_id, bill_id = ii1.bill_id
					FROM (
						SELECT invoice_id, flight_id, bill_id
						FROM invoice_items ii
					) ii1
					WHERE f.id = ii1.flight_id;
				END IF;
			END $$;
	`
	if _, err := tx.Exec(queryDDL); err != nil {
		fmt.Println("Error updating flights", err)
	}

	if _, err := tx.Exec("drop table if exists invoice_items;"); err != nil {
		fmt.Println("Error updating flights", err)
	}
	return nil
}

func downUpdateAllStoreProcedureWithNewInvoiceModels(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}

func updateStoreProcedureAcceptInvoiceWithNewInvoicesModels(tx *sql.Tx) error {
	if _, err := tx.Exec(`drop function if exists accept_invoice(p_ids INTEGER[], p_status text, p_user_id integer);`); err != nil {
		fmt.Println("Error dropping function accept_invoice", err)
		return err
	}
	_, err := tx.Exec(`
		CREATE OR REPLACE FUNCTION accept_invoice(
			p_ids INTEGER[],
			p_status text,
			p_user_id integer
		)  
		RETURNS void AS $$
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
							array_agg(f.id) over(partition by f.invoice_id, p.id) as bills, 
						p.identifier, p.net_payment_terms as payment_terms, true as is_billing, p.production_split as split, p.production_expense_discount_type as discount_type
							from productions p 
							inner join flights f on p.id = f.production_id where lower(p.production_billing_type) = 'billing'
							AND f.invoice_id = inv_id
						),
						cte_billing_productions as (
							select distinct p.id, array[f.id] as bills, p.identifier, p.net_payment_terms as payment_terms, false as is_billing, p.production_split as split,
							p.production_expense_discount_type as discount_type
							from productions p inner join flights f on p.id = f.production_id where lower(p.production_billing_type) = 'collection'
							AND f.invoice_id = inv_id
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
		
					UPDATE flights 
					SET bill_id = b_id, 
						updated_at = (now() at time Zone 'utc'::text),
						status = 'invoiced',
						change_by = p_user_id::text
					where id = any(iit.bills);
					
					SELECT SUM(f.total_cost) into b_ii_amount FROM flights f WHERE f.bill_id = b_id;

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
		
				IF not exists (select 1 from flights f inner join insertion_orders io on f.insertion_order_id = io.id inner join flights ff on io.id = ff.insertion_order_id WHERE ff.status <> 'invoiced' and f.invoice_id = inv_id) then
					UPDATE insertion_orders SET status = 'invoiced', change_by = p_user_id::text 
					FROM (SELECT f.insertion_order_id FROM flights f WHERE f.invoice_id = inv.id) as i
					WHERE id = i.insertion_order_id;
			
				else 
					if exists(select 1 from insertion_orders io inner join flights f on io.id = f.insertion_order_id where f.invoice_id = inv.id and io.status = 'pending') then
						UPDATE insertion_orders SET status = 'partial_invoiced', change_by = p_user_id::text 
						FROM (SELECT f.insertion_order_id FROM flights f WHERE f.invoice_id = inv.id) as i
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

func updateStoreProcedureRecalculateBillWithNewInvoicesModel(tx *sql.Tx) error {
	if _, err := tx.Exec(`drop FUNCTION if exists recalculate_with_expenses(p_production_id INTEGER, p_month text, p_year text, p_user_id integer)`); err != nil {
		fmt.Println("Error dropping function recalculate_bill", err)
		return err
	}
	_, err := tx.Exec(`CREATE OR REPLACE FUNCTION recalculate_with_expenses(p_production_id INTEGER, p_month text, p_year text, p_user_id integer)  
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
			for _bill in select b.*, p.production_split as split, p.production_expense_discount_type as discount_type from bills b join productions p ON b.production_id = p.id
				where b.production_id = p_production_id and b.status = 'pending'
				and due_date is not null and date_part('month', b.due_date) = cast(p_month as integer) AND date_part('year', b.due_date) = cast(p_year as integer)
			LOOP
				raise notice 're-calculating bill %', _bill;
				SELECT SUM(f.total_cost) into _ii_amount FROM flights f WHERE f.bill_id = _bill.id;
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

func updateStoreProcedureGenerateBillToRemoveInvoiceItems(tx *sql.Tx) error {
	if _, err := tx.Exec(`drop FUNCTION if exists generate_invoice(p_flight_ids INTEGER[], p_user_id integer) `); err != nil {
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
					SELECT DISTINCT y.id, array_agg(f.id) over (partition by y.id) as flights, y.payment_terms, sum(f.total_cost) over(partition by y.id) as amount, y.id as payer_id
					FROM insertion_orders i 
					INNER JOIN flights f ON f.insertion_order_id = i.id
					INNER JOIN payers y ON i.payer_id = y.id
					WHERE f.id = ANY(p_flight_ids)

				LOOP 
					RAISE NOTICE 'Processing Insertion Order: %, Flights: %, Amount: %, Payment Terms: %', 
							io.id, io.flights, io.amount, io.payment_terms;             
					SELECT i.id INTO existing_inv_id 
					FROM invoices i
					WHERE i.payer_id = io.id
					AND i.id IN (
					    SELECT f.invoice_id 
					    FROM flights f 
					    WHERE f.id = ANY(io.flights)
					)
					AND i.status = 'draft' LIMIT 1;
					IF existing_inv_id IS NOT NULL THEN
						inv_id := existing_inv_id;
						RAISE NOTICE 'Using existing draft invoice id: %', inv_id;
						UPDATE invoices SET due_date = CURRENT_DATE + (io.payment_terms || ' day')::INTERVAL, invoiced_date = CURRENT_DATE, change_by = p_user_id::text
						WHERE id = inv_id;
					ELSE
						INSERT INTO invoices (identifier, due_date, invoiced_date, amount, balance, status, payer_id, change_by)
						VALUES ('DRAFT', CURRENT_DATE + (io.payment_terms || ' day')::INTERVAL, CURRENT_DATE, io.amount, io.amount, 'draft', io.payer_id, p_user_id::text)
						RETURNING id INTO inv_id;
						RAISE NOTICE 'Created new draft invoice id: %', inv_id;
					END IF;
					
					RAISE NOTICE 'CLEAR DATA of flight related to draft invoice % in %', inv_id, io.flights;
					UPDATE flights f SET invoice_id = null, change_by = p_user_id::text
					WHERE f.invoice_id = inv_id;

					RAISE NOTICE 'MARK Flights of draft invoice % in %', inv_id, io.flights;
					UPDATE flights SET invoice_id = inv_id, change_by = p_user_id::text
					WHERE id = ANY(io.flights);

					RAISE NOTICE 'CLEAR DATA does not % in %', inv_id, io.flights;
					
					DELETE FROM invoices i WHERE i.id NOT IN (SELECT f.invoice_id FROM flights f) AND i.payer_id = io.id;

				END LOOP;

				RAISE NOTICE 'Return DATA';

				RETURN QUERY 
				SELECT DISTINCT i.id as invoice_id, p.entity_name::text as payer, i.amount, p.payment_terms, i.due_date 
				FROM invoices i 
				INNER JOIN payers p ON i.payer_id = p.id
				INNER JOIn flights f ON i.id = f.invoice_id	
				WHERE f.id = ANY(p_flight_ids);
			END;
		$$ LANGUAGE plpgsql;`)
	if err != nil {
		fmt.Println("Error creating function generate_invoice", err)
	}
	return err
}

func updateStoreProcedurePaymentInvoiceToNewInvoicesModel(tx *sql.Tx) error {
	if _, err := tx.Exec(`DROP FUNCTION if exists payment_invoice(p_id integer, p_amount numeric, p_user_id integer);`); err != nil {
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
						for bb in select distinct b.identifier, p.id, f.bill_id, ii.amount, p.production_expense_discount_type as discount_type, p.production_split as split, net_payment_terms 
							from flights f
							inner join productions p on f.production_id = p.id 
							inner join bills b on f.bill_id = b.id 
							where f.invoice_id = p_id and p.production_billing_type = 'collection'
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

func updateStoreProcedurePayablesKPIWithNewInvoiceModel(tx *sql.Tx) error {
	_, err := tx.Exec(`
	CREATE OR REPLACE FUNCTION public.get_payables_kpi(p_start_date date, p_end_date date)
			RETURNS table (
				total_outstanding numeric,
				total_overdue numeric,
				on_time_payment_rate numeric,
				production_payment_on_uncollected_invoices numeric
			)
			LANGUAGE plpgsql
			AS $function$
			DECLARE
				total_outstanding numeric;
				total_overdue numeric;
				on_time_payment_rate numeric;
				production_payment_on_uncollected_invoices numeric;
				_total_paid_amount numeric;
				_total_amount numeric;	
				_total_due_amount numeric;
				
			BEGIN
				total_outstanding := SUM(balance)
					FROM bills
					WHERE created_at BETWEEN p_start_date AND p_end_date AND status <> 'paid';
				if total_outstanding is null then 
				   total_outstanding := 0;
				end if;

				total_overdue := SUM(balance)
				     FROM bills
				     WHERE due_date BETWEEN p_start_date AND p_end_date
				     AND status <> 'paid';

				if total_overdue is null then 
				   total_overdue := 0;
				end if;

				_total_paid_amount := SUM(b.amount) FROM bills b
					INNER JOIN (
					    SELECT 
					        bill_id,
					        MAX(payment_at) AS last_payment_date
					    FROM 
					        bill_payments
					    GROUP BY 
					        bill_id
					) ip ON b.id = ip.bill_id
					where ip.last_payment_date::date BETWEEN p_start_date AND p_end_date and b.status = 'paid' and ip.last_payment_date::date <= b.due_date;

				if _total_paid_amount is null then 
					_total_paid_amount := 0;
				end if;

				_total_amount :=  sum(amount) from bills where created_at::date BETWEEN p_start_date AND p_end_date;
				
				if _total_amount is null then 
					_total_amount := 0;
				end if;

				_total_due_amount :=  sum(amount) from bills where due_date BETWEEN p_start_date AND p_end_date AND status <> 'paid';
				
				if _total_due_amount is null then 
					_total_due_amount := 0;
				end if;

				
				on_time_payment_rate := case when _total_due_amount = 0 then 0 else _total_paid_amount / _total_due_amount * 100 end;
				
				if on_time_payment_rate is null then 
				   on_time_payment_rate := 0;
				end if;


				production_payment_on_uncollected_invoices := (with payment_bills as (
						select distinct b.id, bp.id as payment_id, bp.amount
						from bills b 
						inner join bill_payments bp on b.id = bp.bill_id 
						inner join flights f on b.id = f.bill_id
						inner join invoices i on f.invoice_id = i.id 
						where i.status <> 'paid' and bp.payment_at::date between p_start_date AND p_end_date
					)
					select sum(amount) from payment_bills);

				if production_payment_on_uncollected_invoices is null then 
				   production_payment_on_uncollected_invoices := 0;
				end if;
				
					
				RETURN query select total_outstanding,
				total_overdue,
				on_time_payment_rate::numeric(10,2),
				production_payment_on_uncollected_invoices::numeric(10,2);
			END;
			$function$
			`)
	if err != nil {
		fmt.Println("Error creating function get_payables_kpi", err)
	}
	return err
}
