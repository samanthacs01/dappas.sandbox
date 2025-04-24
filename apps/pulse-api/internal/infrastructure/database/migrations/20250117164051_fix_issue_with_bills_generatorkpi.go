package migrations

import (
	"context"
	"database/sql"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upFixIssueWithBillsGeneratorkpi, downFixIssueWithBillsGeneratorkpi)
}

func upFixIssueWithBillsGeneratorkpi(ctx context.Context, tx *sql.Tx) error {
	const functionBookingKpi string = `
	CREATE OR REPLACE FUNCTION public.get_booking_kpi(start_date date, end_date date)
		RETURNS record
		LANGUAGE plpgsql
		AS $function$
		DECLARE
			result RECORD;
		BEGIN
			SELECT 
				SUM(case when b.total_orders is null then 0 else b.total_orders END) as total_booked, 
				case WHEN SUM(b.total_orders) > 0 THEN SUM(b.total_executed_orders)/SUM(b.total_orders) * 100 ELSE 0 END as fulfilment_rate,
				CASE WHEN SUM(p.grand_total) > 0 THEN SUM(total_per_payer) / SUM(p.grand_total) * 100 ELSE 0 END as top5_percentage_of_total,
				CASE WHEN SUM(kpifp.grand_total) > 0 THEN SUM(kpifp.total_per_production) / SUM(kpifp.grand_total) * 100 ELSE 0 END as top5_production_of_total
			INTO result
			FROM
			(
				SELECT DISTINCT booked_date, total_per_payer, grand_total 
				FROM view_booking_payers_kpi
				WHERE booked_date BETWEEN start_date AND end_date
			) p 
			CROSS JOIN (
				SELECT DISTINCT booked_date, total_orders, total_executed_orders 
				FROM view_booking_kpi
				WHERE booked_date BETWEEN start_date AND end_date
			) b
			CROSS JOIN (
				SELECT DISTINCT booked_date, total_per_production, grand_total 
				FROM view_booking_production_kpi
				WHERE booked_date BETWEEN start_date AND end_date
			) kpifp;

			RETURN result;
		END;
		$function$
		;
`
	tx.Exec(functionBookingKpi)

	var functionGenerateBills string = `
		CREATE OR REPLACE FUNCTION generate_invoice(
			p_flight_ids INTEGER[]
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
					RAISE NOTICE 'Processing Insertion Order: %, Fligts: %, Amount: %, Payment Terms: %', 
							io.id, io.flights, io.amount, io.payment_terms;             
					SELECT id INTO existing_inv_id 
						FROM invoices 
						WHERE insertion_order_id = io.id 
						AND status = 'draft' LIMIT 1;
					IF existing_inv_id IS NOT NULL THEN
						-- Si existe, usar el draft existente y adicionar los nuevos items como draft
						inv_id := existing_inv_id;
						RAISE NOTICE 'Using existing draft invoice id: %', inv_id;
						UPDATE invoices SET due_date = CURRENT_DATE + (io.payment_terms || ' day')::INTERVAL, invoiced_date = CURRENT_DATE
						WHERE id = inv_id;
					ELSE
						-- Si no existe, crear un nuevo draft de factura
						INSERT INTO invoices (identifier, due_date, invoiced_date, insertion_order_id, amount, balance, status, payer_id)
						VALUES ('DRAFT', CURRENT_DATE + (io.payment_terms || ' day')::INTERVAL, CURRENT_DATE, io.id, io.amount, io.amount, 'draft', io.payer_id)
						RETURNING id INTO inv_id;
						RAISE NOTICE 'Created new draft invoice id: %', inv_id;
					END IF;

					FOR fg IN
						SELECT f.id, f.total_cost, f.production_id FROM flights f WHERE f.id =any(io.flights)
					LOOP
							
						IF EXISTS(SELECT 1 FROM invoice_items it WHERE it.flight_id = fg.id AND it.status = 'draft' AND it.invoice_id <> inv_id) THEN
							RAISE NOTICE 'Updating invoices items';
							UPDATE invoice_items i SET invoice_id = inv_id WHERE invoice_items.flight_id = ANY(p_flight_ids) AND invoice_items.status = 'draft' 
								AND NOT EXISTS (
								SELECT 1 
								FROM invoice_items ii 
								WHERE ii.flight_id = i.flight_id
							); 
						ELSE 	
							RAISE NOTICE 'Continue add new items';
							-- Adicionar los nuevos items como draft
							INSERT INTO invoice_items (invoice_id, flight_id, amount, identifier, production_id)
							VaLUES(inv_id, fg.id, fg.total_cost, 'DRAFT', fg.production_id);
						END IF; 
						RAISE NOTICE 'Continue add new items';	
					END LOOP;

					RAISE NOTICE 'CLEAR DATA';
					DELETE FROM invoice_items ii WHERE ii.flight_id = ANY(p_flight_ids) AND ii.invoice_id <> inv_id AND ii.flight_id = ANY(io.flights);
					DELETE FROM invoice_items ii WHERE ii.flight_id <> ALL(io.flights) AND ii.invoice_id = inv_id;
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
		$$ LANGUAGE plpgsql;
	`
	tx.Exec(functionGenerateBills)

	tx.Exec("alter table productions add column if not exists identifier varchar(50) default '';")

	tx.Exec(`UPDATE productions
			SET identifier = LPAD(row_number::text, 3, '0')
			FROM (
				SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS row_number
				FROM productions
			) AS numbered_rows
			WHERE productions.id = numbered_rows.id;`)

	var functionAccept string = `
		CREATE OR REPLACE FUNCTION accept_invoice(
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
    inv RECORD;
	iit record;
BEGIN
    RAISE NOTICE 'Starting';
    FOREACH inv_id IN ARRAY p_ids
    LOOP 
        -- Recalcular el identificador para cada factura
        WITH cte_payers AS (
            SELECT
                DISTINCT MAX(i.identifier) OVER (PARTITION BY p.id) AS identifier,
                p.identifier AS payer_identifier,
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
                p.payer_id,
                'INV-' || p.payer_identifier || '-' || LPAD(COALESCE(MAX(number_part) + 1, 1)::TEXT, 4, '0') AS next_identifier
            FROM cte_payers p
            WHERE p.payer_id in (SELECT payer_id FROM invoices WHERE id = inv_id)
            GROUP BY p.payer_id, p.payer_identifier
        )
        SELECT DISTINCT i.id, n.next_identifier, array_agg(ii.id) over(partition by i.id) as items INTO inv 
        FROM invoices i 
        INNER JOIN cte_next_payer_inv_number n ON i.payer_id = n.payer_id
		INNER JOIN invoice_items ii ON i.id = ii.invoice_id
        WHERE i.id = inv_id
		LIMIT 1;

        RAISE NOTICE 'INVOICE % %', inv.id, inv.next_identifier;
        
        UPDATE invoices 
        SET status = p_status, 
            identifier = inv.next_identifier, 
            invoiced_date = CURRENT_DATE, 
            updated_at = (now() AT TIME ZONE 'utc'::text)
        WHERE id = inv_id;

		for iit in 
			WITH cte_productions AS (
	            SELECT
	                DISTINCT MAX(ii.identifier) OVER (PARTITION BY p.id) AS identifier,
	                p.identifier AS p_identifier,
	                p.id AS p_id,
	                CASE 
	                    WHEN ii.identifier = 'DRAFT' THEN 0 
	                    ELSE CAST(SUBSTRING(ii.identifier FROM 7) AS INTEGER) 
	                END AS number_part
	            FROM
	                invoice_items ii
	            INNER JOIN productions p ON ii.production_id = p.id
	        ),
	        cte_next_p_inv_number AS (
	            SELECT
	                p.p_id,
	                to_char(CURRENT_DATE, 'YY') || '-' || p.p_identifier || '-' || LPAD(COALESCE(MAX(number_part) OVER(partition by p.p_id) + 1, 1)::TEXT, 4, '0') AS next_identifier

	            FROM cte_productions p
	            WHERE p.p_id in (SELECT production_id FROM invoice_items WHERE id = any(inv.items))
	            --GROUP BY p.p_id, billing_type, p.p_identifier
	        ), 
			cte_collection_productions as (
				select p.id, array_agg(ii.id) over(partition by ii.invoice_id, p.id) as bills
				from productions p inner join invoice_items ii on p.id = ii.production_id where p.production_billing_type = 'collection'
				AND ii.id = any(inv.items)
			),
			cte_billing_productions as (
				select distinct p.id, array[ii.id] as bills
				from productions p inner join invoice_items ii on p.id = ii.production_id where p.production_billing_type = 'billing'
				AND ii.id = any(inv.items)
			)
			SELECT p_id, bills, next_identifier 
			FROM cte_collection_productions p
			INNER JOIN cte_next_p_inv_number n ON p.id = n.p_id
			UNION ALL
			SELECT p_id, bills, next_identifier FROM cte_billing_productions p
			INNER JOIN cte_next_p_inv_number n ON p.id = n.p_id

			LOOP
		
				UPDATE invoice_items SET identifier = iit.next_identifier, updated_at = (now() at time Zone 'utc'::text)
				where id = any(iit.bills);
			
			    UPDATE flights SET status = 'invoiced' 
				FROM (
					SELECT flight_id from invoice_items WHERE id =any(iit.bills)
				) as _ii 
				WHERE id = _ii.flight_id;
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
$$ LANGUAGE plpgsql;
`

	tx.Exec(functionAccept)

	// This code is executed when the migration is applied.
	return nil
}

func downFixIssueWithBillsGeneratorkpi(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
