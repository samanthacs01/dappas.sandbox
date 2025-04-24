-- +goose Up
DROP VIEW IF EXISTS view_collection_bills;

create or replace view view_collection_bills
as
 SELECT DISTINCT b.id,
    f.identifier,
    b.identifier AS b_identifier,
    i.payer_id,
    y.entity_name AS payer,
    to_char(b.due_date::timestamp with time zone, 'MM/DD/YYYY'::text) AS due_date,
    b.revenue,
    b.status,
    b.production_id,
    b.amount,
    p.entity_name AS production,
    b.balance,
    b.due_date AS d_due_date
   FROM bills b
     JOIN flights f ON f.bill_id = b.id
     JOIN invoices i ON i.id = f.invoice_id
     JOIN productions p ON b.production_id = p.id
     JOIN payers y ON i.payer_id = y.id
  WHERE p.production_billing_type::text = 'collection'::text;
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
