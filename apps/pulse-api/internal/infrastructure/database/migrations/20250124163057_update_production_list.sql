-- +goose Up
drop view view_productions;

create or replace view view_productions  as
	with paid_bills as (
		SELECT bp.bill_id, MAX(bp.payment_at) AS last_payment_date
		FROM bill_payments bp 
		inner join bills b on bp.bill_id = b.id 	
		where b.status = 'paid' GROUP BY bp.bill_id
	),
	paid_invoices as (
		select ii.bill_id, MAX(ip.paid_at) AS last_payment_date
		from invoice_payments ip
		inner join invoices i on ip.invoice_id = i.id
		inner join invoice_items ii on i.id = ii.invoice_id
		where i.status = 'paid'
		group by ii.bill_id
	)
	select 
		p.id, 
		p.entity_name, 
		case when b.id is null then 0 else sum(b.balance) over(partition by p.id) end as balance, -- mock data 
		case when pb.bill_id is null or pin.bill_id is null then 0 else AVG(EXTRACT(DAY FROM (pb.last_payment_date - pin.last_payment_date))) over(partition by p.id) end as dpo,  -- mock data 
		production_billing_type as payment_type
		from productions p 
		left join bills b on p.id = b.production_id and b.deleted_at is null
		left join paid_bills pb on b.id = pb.bill_id
		left join paid_invoices pin on b.id = pin.bill_id
		where p.deleted_at is null;

	
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
