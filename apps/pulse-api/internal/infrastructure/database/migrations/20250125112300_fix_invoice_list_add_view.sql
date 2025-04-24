-- +goose Up
drop view if exists view_invoices;
create or replace view view_invoices as
with productions_and_bills as (
  select ii.invoice_id, 
  ARRAY_AGG(distinct p.id) as productions_ids,
  ARRAY_AGG(distinct p.entity_name) as productions,
  ARRAY_AGG(distinct b.identifier) as bills
  FROM invoice_items ii 
  inner join productions p on ii.production_id = p.id 
  left join bills b on ii.bill_id = b.id AND b.deleted_at is NULL
  where ii.deleted_at is null and p.deleted_at is null
  group by ii.invoice_id
)
select i.id,
		   i.identifier,
		   y.entity_name as payer,
		   pb.productions,
		   pb.bills,
		   i.amount as amount_to_pay,
		   i.balance as balance,
		   y.payment_terms,
		   invoiced_date,
		   due_date,
		   i.status,
		   pb.productions_ids,
		   y.id as payer_id
	from invoices i inner join payers y on i.payer_id = y.id 
    inner join productions_and_bills as pb on i.id = pb.invoice_id
	where i.deleted_at is null and y.deleted_at is null;
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
