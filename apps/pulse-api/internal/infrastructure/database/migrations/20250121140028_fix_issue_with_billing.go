package migrations

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upFixIssueWithBilling, downFixIssueWithBilling)
}

func upFixIssueWithBilling(ctx context.Context, tx *sql.Tx) error {
	generateBillingFunction := `
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
								INSERT INTO invoice_items (invoice_id, flight_id, amount, production_id)
								VaLUES(inv_id, fg.id, fg.total_cost, fg.production_id);
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

	_, err := tx.ExecContext(ctx, generateBillingFunction)
	if err != nil {
		fmt.Println("Error creating generate_invoice function")
	}
	return err
}

func downFixIssueWithBilling(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
