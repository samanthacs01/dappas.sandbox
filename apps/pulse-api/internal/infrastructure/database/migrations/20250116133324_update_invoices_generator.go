package migrations

import (
	"context"
	"database/sql"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upUpdateInvoicesGenerator, downUpdateInvoicesGenerator)
}

const function string = `
	CREATE OR REPLACE FUNCTION generate_invoice(
    p_insertion_order_id INTEGER,
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
		payment_terms integer;
		io RECORD;
	BEGIN
		RAISE NOTICE 'Starting';
		SELECT p.payment_terms INTO payment_terms 
		FROM insertion_orders ord 
		JOIN payers p ON ord.payer_id = p.id 
		WHERE ord.id = p_insertion_order_id;
		SELECT * INTO io 
		FROM insertion_orders 
		WHERE id = p_insertion_order_id;
		-- Verificar si ya existe un draft de factura para la orden de inserción dada
		SELECT id INTO existing_inv_id 
		FROM invoices 
		WHERE insertion_order_id = p_insertion_order_id 
		AND status = 'draft' LIMIT 1;
		IF existing_inv_id IS NOT NULL THEN
			-- Si existe, usar el draft existente y adicionar los nuevos items como draft
			inv_id := existing_inv_id;
			RAISE NOTICE 'Using existing draft invoice id: %', inv_id;
			UPDATE invoices SET due_date = CURRENT_DATE + (payment_terms || ' day')::INTERVAL, invoiced_date = CURRENT_DATE
			WHERE id = inv_id;
		ELSE
			-- Si no existe, crear un nuevo draft de factura
			INSERT INTO invoices (identifier, due_date, invoiced_date, insertion_order_id, amount, balance, status, payer_id)
			VALUES ('DRAFT', CURRENT_DATE + (payment_terms || ' day')::INTERVAL, CURRENT_DATE, io.id, io.net_total_io_cost, io.net_total_io_cost, 'draft', io.payer_id)
			RETURNING id INTO inv_id;
			RAISE NOTICE 'Created new draft invoice id: %', inv_id;
		END IF;
		IF EXISTS(SELECT 1 FROM invoice_items it WHERE it.flight_id = ANY(p_flight_ids) AND it.status = 'draft' AND it.invoice_id <> inv_id) THEN
			RAISE NOTICE 'Updating invoices items';
			UPDATE invoice_items i SET invoice_id = inv_id WHERE invoice_items.flight_id = ANY(p_flight_ids) AND invoice_items.status = 'draft' 
				AND NOT EXISTS (
				SELECT 1 
				FROM invoice_items ii 
				WHERE ii.flight_id = i.flight_id
			); 
		END IF; 
		RAISE NOTICE 'Continue add new items';
		-- Adicionar los nuevos items como draft
		INSERT INTO invoice_items (invoice_id, flight_id, amount, identifier, production_id)
		SELECT inv_id, f.id, f.total_cost, 'DRAFT', f.production_id
		FROM flights f
		WHERE f.id = ANY(p_flight_ids) 
		AND NOT EXISTS (
			SELECT 1 
			FROM invoice_items ii 
			WHERE ii.flight_id = f.id 
				AND ii.invoice_id = inv_id
		);
		RAISE NOTICE 'CLEAR DATA';
		DELETE FROM invoice_items ii WHERE ii.flight_id = ANY(p_flight_ids) AND ii.invoice_id <> inv_id;
		DELETE FROM invoice_items ii WHERE ii.flight_id <> ALL(p_flight_ids) AND ii.invoice_id = inv_id;
		DELETE FROM invoices i WHERE i.id NOT IN (SELECT ii.invoice_id FROM invoice_items ii) AND i.insertion_order_id = p_insertion_order_id;
		RAISE NOTICE 'Return DATA';
		RETURN QUERY 
		SELECT i.id as invoice_id, p.entity_name::text as payer, i.amount, p.payment_terms, i.due_date 
		FROM invoices i 
		INNER JOIN payers p ON i.payer_id = p.id
		WHERE i.id = inv_id;
	END;
$$ LANGUAGE plpgsql;
`

const function2 string = `
CREATE OR REPLACE FUNCTION get_booking_kpi(start_date DATE, end_date DATE)
RETURNS RECORD AS $$
DECLARE
    result RECORD;
BEGIN
    SELECT 
        SUM(b.total_orders) as total_booked, 
        SUM(b.percent)::NUMERIC as fulfilment_rate,
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
        SELECT DISTINCT booked_date, total_orders, percent 
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
$$ LANGUAGE plpgsql;`

func upUpdateInvoicesGenerator(ctx context.Context, tx *sql.Tx) error {
	tx.Exec(function)
	tx.Exec(function2)
	return nil
}

func downUpdateInvoicesGenerator(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
