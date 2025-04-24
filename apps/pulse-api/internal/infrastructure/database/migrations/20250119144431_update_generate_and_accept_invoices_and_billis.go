package migrations

import (
	"context"
	"database/sql"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upUpdateGenerateAndAcceptInvoicesAndBillis, downUpdateGenerateAndAcceptInvoicesAndBillis)
}

func upUpdateGenerateAndAcceptInvoicesAndBillis(ctx context.Context, tx *sql.Tx) error {
	tx.Exec("alter table invoice_items add column if not exists due_date date;")
	funGenerateInvoiceAndBills := `
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
						UPDATE invoices SET due_date = CURRENT_DATE + (io.payment_terms || ' day')::INTERVAL, invoiced_date = CURRENT_DATE
						WHERE id = inv_id;
					ELSE
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
							UPDATE invoice_items i SET invoice_id = inv_id 
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
								INSERT INTO invoice_items (invoice_id, flight_id, amount, identifier, production_id)
								VaLUES(inv_id, fg.id, fg.total_cost, 'DRAFT', fg.production_id);
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
		$$ LANGUAGE plpgsql;
	`
	tx.Exec(funGenerateInvoiceAndBills)

	funAcceptInvoiceAndBills := `
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
	p_next_identifier text;
    inv RECORD;
	iit record;
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
					select p.id, array_agg(ii.id) over(partition by ii.invoice_id, p.id) as bills, p.identifier, p.net_payment_terms as payment_terms
					from productions p inner join invoice_items ii on p.id = ii.production_id where p.production_billing_type = 'billing'
					AND ii.invoice_id = inv_id
				),
				cte_billing_productions as (
					select distinct p.id, array[ii.id] as bills, p.identifier, p.net_payment_terms as payment_terms
					from productions p inner join invoice_items ii on p.id = ii.production_id where p.production_billing_type = 'collection'
					AND ii.invoice_id = inv_id
				)
	           SELECT p.id, p.bills, p.identifier, p.payment_terms from cte_collection_productions p
			   UNION 
			   SELECT p.id, p.bills, p.identifier, p.payment_terms from cte_billing_productions p

           LOOP 
			WITH cte_productions AS (
	            SELECT DISTINCT
					ii.production_id as p_id,
	                 MAX(ii.identifier) OVER (PARTITION BY ii.production_id) AS identifier,
	                CASE 
	                    WHEN ii.identifier = 'DRAFT' THEN 0 
	                    ELSE CAST(SUBSTRING(ii.identifier FROM 8) AS INTEGER) 
	                END AS number_part
	            FROM
	                invoice_items ii
                WHERE ii.production_id = iit.id
	        ),
	        cte_next_p_inv_number AS (
	            SELECT
	                p.p_id,
					p.identifier,
	                to_char(CURRENT_DATE, 'YY') || '-' || iit.identifier  || '-' || LPAD(COALESCE(MAX(number_part) OVER(partition by p.p_id) + 1, 1)::TEXT, 4, '0') AS next_identifier

	            FROM cte_productions p
	        )
			SELECT next_identifier INTO p_next_identifier
			FROM cte_next_p_inv_number;

			RAISE NOTICE 'NEXT Production Bill % to %', p_next_identifier, iit.bills;
		
			UPDATE invoice_items 
			SET identifier = case when identifier = 'DRAFT' then p_next_identifier else identifier end, 
				updated_at = (now() at time Zone 'utc'::text),
				due_date = CURRENT_DATE + (iit.payment_terms||' day')::interval
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
	tx.Exec(funAcceptInvoiceAndBills)

	functionGetDraftToProcess := `
		CREATE OR REPLACE FUNCTION get_draft_to_process(batch INTEGER)  
		RETURNS TABLE (
			id INTEGER,
			filepath text
		) AS $$

		BEGIN
			RAISE NOTICE 'Starting';
			return query
				SELECT d.id, d.file_path::text as filepath 
				FROM io_drafts d
				WHERE status = 'uploaded' or (status = 'extracting_information' and updated_at < (now() at time zone 'utc'::text) - '1 hour'::interval)
				LIMIT batch;
		END;
		$$ LANGUAGE plpgsql;
	`
	tx.Exec(functionGetDraftToProcess)

	functionProductionNextIdentifier := `
		CREATE OR REPLACE FUNCTION production_next_identifier()
		RETURNS text AS $$
		DECLARE
			next_identifier text;
		BEGIN
			RAISE NOTICE 'Starting';
			SELECT LPAD(COALESCE(cast(identifier as integer) + 1, 1)::TEXT, 3, '0') into next_identifier
			FROM productions p
			ORDER BY identifier DESC
			LIMIT 1;
			
			return next_identifier;
			
		END;
		$$ LANGUAGE plpgsql;
	`
	tx.Exec(functionProductionNextIdentifier)
	tx.Exec("alter table productions alter column identifier set default production_next_identifier()")

	functionPayersNextIdentifier := `
		CREATE OR REPLACE FUNCTION payer_next_identifier()
		RETURNS text AS $$
		DECLARE
			next_identifier text;
		BEGIN
			RAISE NOTICE 'Starting';
			SELECT LPAD(COALESCE(cast(identifier as integer) + 1, 1)::TEXT, 3, '0') into next_identifier
			FROM payers p
			ORDER BY identifier DESC
			LIMIT 1;
			
			return next_identifier;
			
		END;
		$$ LANGUAGE plpgsql;
	`
	tx.Exec(functionPayersNextIdentifier)
	tx.Exec("alter table payers alter column identifier set default payer_next_identifier()")

	tx.Exec(`UPDATE productions
			SET identifier = LPAD(row_number::text, 3, '0')
			FROM (
				SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS row_number
				FROM productions
			) AS numbered_rows
			WHERE productions.id = numbered_rows.id;`)
	tx.Exec(`UPDATE payers
			SET identifier = LPAD(row_number::text, 3, '0')
			FROM (
				SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS row_number
				FROM payers
			) AS numbered_rows
			WHERE payers.id = numbered_rows.id;`)
	// This code is executed when the migration is applied.
	return nil
}

func downUpdateGenerateAndAcceptInvoicesAndBillis(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
