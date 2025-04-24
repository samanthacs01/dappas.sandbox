package migrations

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upFixInvoiceAccept, downFixInvoiceAccept)
}

func upFixInvoiceAccept(ctx context.Context, tx *sql.Tx) error {
	err := updateStoreProcedureAcceptInvoiceRemoveReferenceBillInvoiceId(tx)
	return err
}

func downFixInvoiceAccept(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}

func updateStoreProcedureAcceptInvoiceRemoveReferenceBillInvoiceId(tx *sql.Tx) error {
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
							INSERT INTO bills(production_id, identifier, amount, balance, due_date, change_by)
							VALUES(iit.id, bill_next_identifier(iit.id), 0, 0, (date_trunc('month', b_due_date) + INTERVAL '1 month' - INTERVAL '1 day')::date, p_user_id::text)
							returning id into b_id;
		
						end if;
		
					ELSE  
						INSERT INTO bills(production_id, identifier, amount, balance, due_date, change_by)
							VALUES(iit.id, bill_next_identifier(iit.id), 0, 0, null, p_user_id::text)
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
