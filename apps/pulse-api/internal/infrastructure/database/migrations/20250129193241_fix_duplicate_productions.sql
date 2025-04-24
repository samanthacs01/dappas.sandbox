-- +goose Up
drop view view_productions;

create or replace view view_productions  as
WITH paid_bills AS (
         SELECT bp.bill_id,
            max(bp.payment_at) AS last_payment_date
           FROM bill_payments bp
             JOIN bills b_1 ON bp.bill_id = b_1.id
          WHERE b_1.status::text = 'paid'::text
          GROUP BY bp.bill_id
        ), paid_invoices AS (
         SELECT f.bill_id,
            max(ip.paid_at) AS last_payment_date
           FROM invoice_payments ip
             JOIN invoices i ON ip.invoice_id = i.id
             JOIN flights f ON i.id = f.invoice_id
          WHERE i.status = 'paid'::text
          GROUP BY f.bill_id
        )
 SELECT distinct p.id,
    p.entity_name,
        CASE
            WHEN b.id IS NULL THEN 0::numeric
            ELSE sum(b.balance) OVER (PARTITION BY p.id)
        END AS balance,
        CASE
            WHEN pb.bill_id IS NULL OR pin.bill_id IS NULL THEN 0::numeric
            ELSE avg(EXTRACT(day FROM pb.last_payment_date - pin.last_payment_date)) OVER (PARTITION BY p.id)
        END AS dpo,
    p.production_billing_type AS payment_type
   FROM productions p
     LEFT JOIN bills b ON p.id = b.production_id AND b.deleted_at IS NULL
     LEFT JOIN paid_bills pb ON b.id = pb.bill_id
     LEFT JOIN paid_invoices pin ON b.id = pin.bill_id
  WHERE p.deleted_at IS NULL;
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
