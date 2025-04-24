-- +goose Up
DROP VIEW IF EXISTS view_collection_bills;
create or replace view view_collection_bills
as
select distinct
   b.id,
   f.identifier,
   b.identifier as  b_identifier,
   i.payer_id,
   y.entity_name as payer,
   to_char(b.due_date, 'DD/MM/YYYY') as due_date,
   b.revenue,
   b.status,
   b.production_id,
   b.amount,
   p.entity_name as "production",
   b.balance
from bills b
inner join invoice_items ii on ii.bill_id = b.id
inner join invoices i on i.id = b.invoice_id
inner join flights f on f.id = ii.flight_id 
inner join productions p on b.production_id = p.id
inner join payers y on i.payer_id = y.id
where p.production_billing_type = 'collection';

DROP VIEW IF EXISTS view_billing_bills;
create or replace view view_billing_bills
as
select distinct
   b.id,
   to_char(b.due_date, 'Month') as bill_month,
   b.identifier as  b_identifier,
   to_char(b.due_date, 'DD/MM/YYYY') as due_date,
   b.revenue,
   b.amount as net_due,
   b.balance,
   (select sum(e.total_deduction) from expenses e 
         where e.production_id = p.id and cast(e."month" as integer) = date_part('month', b.due_date) and cast(e."year" as integer) = date_part('year', b.due_date)) as expenses,
   b.status,
   b.production_id,
   date_part('month', b.due_date) as "month",
   b.due_date as d_due_date,
   p.entity_name AS "production"
from bills b
inner join productions p on b.production_id = p.id
where p.production_billing_type = 'billing';


-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
