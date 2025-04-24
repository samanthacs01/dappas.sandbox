package migrations

import (
	"context"
	"database/sql"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upAddBillsModels, downAddBillsModels)
}

func upAddBillsModels(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is applied.
	if err := addOrUpdateTables(tx); err != nil {
		return err
	}
	if err := addOrUpdateProcedures(tx); err != nil {
		return err
	}
	return nil
}

func downAddBillsModels(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}

func addOrUpdateTables(tx *sql.Tx) error {
	billsTable := `
		create table if not exists bills
		(
			id serial primary key,
			production_id integer not null references productions(id),
			invoice_id integer not null references invoices(id),
			identifier varchar(50) not null,
			due_date date,
			amount numeric not null default 0,
			balance numeric not null default 0,
			revenue numeric not null default 0,
			retention numeric not null default 0,
			status varchar(50) not null default 'pending',
			created_at timestamp not null default (now() at time zone 'utc'::text),
			created_month_at timestamp not null default date_trunc('month',now() at time zone 'utc'::text),
			created_week_at timestamp not null default date_trunc('week',now() at time zone 'utc'::text),
			updated_at timestamp not null default (now() at time zone 'utc'::text),
			deleted_at timestamp  null default null
		);
	`
	_, err := tx.Exec(billsTable)
	if err != nil {
		return err
	}

	billsPaymentTable := `
		create table if not exists bill_payments (
			id serial primary key,
			bill_id integer not null references bills(id),
			payment_at timestamp not null default (now() at time zone 'utc'::text),
			payment_month_at timestamp not null default date_trunc('month',now() at time zone 'utc'::text),
			payment_week_at timestamp not null default date_trunc('week',now() at time zone 'utc'::text),
			amount numeric not null default 0
		);
	`
	_, err = tx.Exec(billsPaymentTable)
	if err != nil {
		return err
	}

	_, err = tx.Exec("alter table invoice_items add column if not exists bill_id integer references bills(id);")
	if err != nil {
		return err
	}
	_, err = tx.Exec("alter table invoice_items drop column if exists identifier;")

	if err != nil {
		return err
	}
	view := `
		create or replace view view_bills as 
		SELECT DISTINCT b.id, b.identifier, p.id as production_id, p.entity_name as production, p.production_billing_type as payment_type, 
		(CASE WHEN p.production_billing_type = 'billing' THEN trim(to_char(b.due_date, 'Month')) ELSE f.identifier END) as flight_month, 
		b.amount, b.balance, to_char(b.due_date, 'MM/DD/YY') as due_date, b.status 
		FROM bills b INNER JOIN productions p ON b.production_id = p.id INNER JOIN invoice_items ii ON ii.bill_id = b.id INNER JOIN flights f ON ii.flight_id = f.id
	`
	_, err = tx.Exec(view)

	return err
}

func addOrUpdateProcedures(tx *sql.Tx) error {
	funIdentifierGenerator := `
		CREATE OR REPLACE FUNCTION bill_next_identifier(p_production_id integer)
			RETURNS text AS $$
			DECLARE
					next_id text;
			BEGIN
				WITH cte_productions AS (
					SELECT DISTINCT
						p.id as p_id,
						p.identifier,
						CASE 
							WHEN b.identifier = 'DRAFT' OR b.identifier is null THEN 0 
							ELSE CAST(SUBSTRING(b.identifier FROM 8) AS INTEGER) 
						END AS number_part
					FROM productions p
					LEFT JOIN bills b on b.production_id = p.id
					WHERE p.id = p_production_id
				),
				cte_next_p_inv_number AS (
						SELECT
						p.p_id,
						p.identifier,
						to_char(CURRENT_DATE, 'YY') || '-' || p.identifier  || '-' || LPAD(COALESCE(MAX(number_part) OVER(partition by p.p_id) + 1, 1)::TEXT, 4, '0') AS next_identifier

						FROM cte_productions p
				)
				SELECT next_identifier INTO next_id
				FROM cte_next_p_inv_number;
				return next_id;
			END;
			$$ LANGUAGE plpgsql;
	`
	if _, err := tx.Exec(funIdentifierGenerator); err != nil {
		return err
	}

	updateBillGeneratorFun := `CREATE OR REPLACE FUNCTION accept_invoice(
    p_ids INTEGER[],
    p_status text
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
            updated_at = (now() AT TIME ZONE 'utc'::text)
        WHERE id = inv_id;

		for iit in 
				WITH 
				cte_collection_productions as (
					select p.id, 
					array_agg(ii.id) over(partition by ii.invoice_id, p.id) as bills, 
				p.identifier, p.net_payment_terms as payment_terms, true as is_billing, p.production_split as split, p.production_expense_discount_type as discount_type
					from productions p inner join invoice_items ii on p.id = ii.production_id where p.production_billing_type = 'billing'
					AND ii.invoice_id = inv_id
				),
				cte_billing_productions as (
					select distinct p.id, array[ii.id] as bills, p.identifier, p.net_payment_terms as payment_terms, false as is_billing, p.production_split as split,
					p.production_expense_discount_type as discount_type
					from productions p inner join invoice_items ii on p.id = ii.production_id where p.production_billing_type = 'collection'
					AND ii.invoice_id = inv_id
				)
	           SELECT p.id, p.bills, p.identifier, p.payment_terms, is_billing, split, discount_type from cte_collection_productions p
			   UNION 
			   SELECT p.id, p.bills, p.identifier, p.payment_terms, is_billing, split, discount_type from cte_billing_productions p

           LOOP 
			
			b_due_date := CURRENT_DATE + (iit.payment_terms||' day')::interval;
		   
			IF iit.is_billing THEN
				if EXISTS(SELECT 1 FROM bills b WHERE date_part('month', b.due_date) = date_part('month', b_due_date) AND date_part('year', b.due_date) = date_part('year', b_due_date)) THEN
					SELECT id INTO b_id FROM bills b WHERE date_part('month', b.due_date) = date_part('month', b_due_date) AND date_part('year', b.due_date) = date_part('year', b_due_date)
					LIMIT 1;
				else 

				    INSERT INTO bills(invoice_id, production_id, identifier, amount, balance, due_date)
					VALUES(inv.id, iit.id, bill_next_identifier(iit.id), 0, 0, (date_trunc('month', b_due_date) + INTERVAL '1 month' - INTERVAL '1 day')::date)
					returning id into b_id;

				end if;

			ELSE  

				INSERT INTO bills(invoice_id, production_id, identifier, amount, balance, due_date)
					VALUES(inv.id, iit.id, bill_next_identifier(iit.id), 0, 0, null)
					returning id into b_id;

		    END IF;
	

			RAISE NOTICE 'NEXT Production Bill % to %', b_id, iit.bills;

			UPDATE invoice_items 
			SET bill_id = b_id, 
				updated_at = (now() at time Zone 'utc'::text),
				due_date = b_due_date
			where id = any(iit.bills);

			UPDATE flights SET status = 'invoiced' 
				FROM (
					SELECT flight_id from invoice_items WHERE id =any(iit.bills)
				) as _ii 
				WHERE id = _ii.flight_id;
			
			SELECT SUM(ii.amount) into b_ii_amount FROM invoice_items ii WHERE ii.bill_id = b_id;
			if iit.is_billing then 
				SELECT SUM(e.total_deduction) into b_deduction FROM expenses e WHERE e.production_id = iit.id 
					AND CAST(e.month as INTEGER) = date_part('month', b_due_date) 
					AND CAST(e.year as INTEGER) = date_part('year', b_due_date);
			else 
				b_deduction := (SELECT SUM(e.total_deduction) FROM expenses e WHERE e.production_id = iit.id 
					AND CAST(e.month as INTEGER) = date_part('month', b_due_date) 
					AND CAST(e.year as INTEGER) = date_part('year', b_due_date)) 
					- (SELECT SUM(b.retention) FROM bills b JOIN productions p on b.production_id = p.id 
						WHERE p.production_billing_type = 'collection' AND  date_part('month', b.due_date)  = date_part('month', b_due_date) 
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
				amount = case when b_amount is null then 0 else b_amount end,
				revenue = case when b_revenue is null or b_revenue < 0 then 0 else b_revenue end,
				balance = case when b_revenue is null or b_revenue < 0 then 0 else b_revenue end,
				retention = case when b_retention is null then 0 else b_retention end
			WHERE id = b_id;
		END LOOP;

		IF not exists (select 1 from flights f inner join invoice_items ii on f.id = ii.invoice_id WHERE f.status <> 'invoiced') then
			UPDATE insertion_orders SET status = 'invoiced' 
			FROM (SELECT insertion_order_id FROM invoices WHERE id = inv.id) as i
			WHERE id = i.insertion_order_id;
	
		else 
			UPDATE insertion_orders SET status = 'partial_invoiced' 
			FROM (SELECT insertion_order_id FROM invoices WHERE id = inv.id) as i
			WHERE id = i.insertion_order_id;
		end if;	
	 END LOOP;
END;
$$ LANGUAGE plpgsql;`

	if _, err := tx.Exec(updateBillGeneratorFun); err != nil {
		return err
	}
	functionRegisterInvoicePayment := `
		CREATE OR REPLACE FUNCTION payment_invoice(p_id INTEGER, p_amount numeric)  
		RETURNS VOID AS $$
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
			insert into invoice_payments(invoice_id, amount)
			values (p_id, p_amount);
			
			update invoices 
				set status = case when balance - p_amount > 0 then 'partial_paid' else 'paid' end,
					balance = balance - p_amount
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
				b_deduction := (SELECT SUM(e.total_deduction) FROM expenses e WHERE e.production_id = bb.id 
					AND CAST(e.month as INTEGER) = date_part('month', CURRENT_DATE + INTERVAL '1 day' * bb.net_payment_terms) 
					AND CAST(e.year as INTEGER) = date_part('year', CURRENT_DATE + INTERVAL '1 day' * bb.net_payment_terms)) 
					- (SELECT SUM(b.retention) FROM bills b JOIN productions p on b.production_id = p.id 
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
						due_date = CURRENT_DATE + INTERVAL '1 day' * bb.net_payment_terms
				    WHERE b.id = bb.bill_id;
				
				END LOOP;
			end if; 

		END;
		$$ LANGUAGE plpgsql;
	`
	if _, err := tx.Exec(functionRegisterInvoicePayment); err != nil {
		return err
	}

	funPaymentBills := `
		CREATE OR REPLACE FUNCTION payment_bill(p_id INTEGER, p_amount numeric)  
		RETURNS VOID AS $$
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
			insert into bill_payments(bill_id, amount)
			values (p_id, p_amount);
			
			update bills 
				set status = case when balance - p_amount > 0 then 'partial_paid' else 'paid' end,
					balance = case when balance - p_amount > 0 then balance - p_amount else 0 end
			where id = p_id;

		END;
		$$ LANGUAGE plpgsql;
	`
	if _, err := tx.Exec(funPaymentBills); err != nil {
		return err
	}
	return nil
}
