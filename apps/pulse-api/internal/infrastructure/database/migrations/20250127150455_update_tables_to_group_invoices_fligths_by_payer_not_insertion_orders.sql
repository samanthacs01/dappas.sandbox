-- +goose Up

alter table flights add column if not exists invoice_id integer references invoices(id);
alter table flights add column if not exists bill_id integer references bills(id);


CREATE OR REPLACE VIEW public.view_collection_bills
AS SELECT DISTINCT b.id,
    f.identifier,
    b.identifier AS b_identifier,
    i.payer_id,
    y.entity_name AS payer,
    to_char(b.due_date::timestamp with time zone, 'DD/MM/YYYY'::text) AS due_date,
    b.revenue,
    b.status,
    b.production_id,
    b.amount,
    p.entity_name AS production,
    b.balance
   FROM bills b
     JOIN flights f ON f.bill_id = b.id
     JOIN invoices i ON i.id = f.invoice_id
     JOIN productions p ON b.production_id = p.id
     JOIN payers y ON i.payer_id = y.id
  WHERE p.production_billing_type::text = 'collection'::text;

-- public.view_productions source

CREATE OR REPLACE VIEW public.view_productions
AS WITH paid_bills AS (
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
 SELECT p.id,
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

CREATE OR REPLACE VIEW public.view_bills
AS SELECT DISTINCT b.id,
    b.identifier,
    p.id AS production_id,
    p.entity_name AS production,
    p.production_billing_type AS payment_type,
        CASE
            WHEN p.production_billing_type::text = 'billing'::text THEN TRIM(BOTH FROM to_char(b.due_date::timestamp with time zone, 'Month'::text))::character varying
            ELSE f.identifier
        END AS flight_month,
    b.amount,
    b.balance,
    to_char(b.due_date::timestamp with time zone, 'MM/DD/YY'::text) AS due_date,
    b.status
   FROM bills b
     JOIN productions p ON b.production_id = p.id
     JOIN flights f ON f.bill_id = b.id;

-- public.view_invoices source

CREATE OR REPLACE VIEW public.view_invoices
AS WITH productions_and_bills AS (
         SELECT f.invoice_id,
            array_agg(DISTINCT p.id) AS productions_ids,
            array_agg(DISTINCT p.entity_name) AS productions,
            array_agg(DISTINCT b.identifier) AS bills
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
    y.id AS payer_id
   FROM invoices i
     JOIN payers y ON i.payer_id = y.id
     JOIN productions_and_bills pb ON i.id = pb.invoice_id
  WHERE i.deleted_at IS NULL AND y.deleted_at IS NULL;


alter table invoices drop  column if exists insertion_order_id;
alter table bills drop  column if exists invoice_id;

DELETE from activity_logs WHERE entity_name = 'invoice_items';
--

-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
