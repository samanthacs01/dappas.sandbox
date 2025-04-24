-- +goose Up
DROP VIEW IF EXISTS public.view_invoices;
CREATE OR REPLACE VIEW public.view_invoices
AS WITH productions_and_bills AS (
         SELECT f.invoice_id,
            array_agg(DISTINCT p.id) AS productions_ids,
            array_agg(DISTINCT p.entity_name) AS productions,
            array_agg(DISTINCT b.identifier) AS bills,
			array_agg(DISTINCT f.advertiser) AS advertisers
           FROM flights f
             JOIN productions p ON f.production_id = p.id
             LEFT JOIN bills b ON f.bill_id = b.id AND b.deleted_at IS NULL
          WHERE f.deleted_at IS NULL AND p.deleted_at IS NULL
          GROUP BY f.invoice_id
        )
 SELECT i.id,
    i.identifier,
    y.entity_name AS payer,
    pb.productions,
    pb.bills,
    i.amount AS amount_to_pay,
    i.balance,
    y.payment_terms,
    i.invoiced_date,
    i.due_date,
    i.status,
    pb.productions_ids,
    y.id AS payer_id,
	pb.advertisers
   FROM invoices i
     JOIN payers y ON i.payer_id = y.id
     JOIN productions_and_bills pb ON i.id = pb.invoice_id
  WHERE i.deleted_at IS NULL AND y.deleted_at IS NULL;

-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
