-- +goose Up
DROP VIEW IF EXISTS view_activity_logs;
create or replace view view_activity_logs as
 SELECT l.id,
    l.action_at,
        CASE
            WHEN u.id IS NULL THEN l.own_by
            ELSE u.email
        END AS own_by,
    l.entity_name AS entity,
    l.entity_id,
    l.action_type AS action,
        CASE
            WHEN l.action_type = 'DELETE' THEN l.old_data
            ELSE l.new_data
        END AS action_data,
    (((l.entity_name || '&') || l.own_by) || '&') || l.action_type AS search_field
   FROM activity_logs l
     LEFT JOIN users u ON l.own_by = u.id::text;


drop view if exists view_flights;
create or replace view view_flights as
select 
	f.id,
	f.identifier,
	io.number as insertion_order,
	y.entity_name as payer,
	p.entity_name as production,
	f.total_cost,
	ARRAY(
        SELECT DISTINCT unnest(ARRAY_AGG(
            CASE 
                WHEN value_type = 'range' THEN 
                    TO_CHAR(init_date, 'MM/DD/YYYY') || ' - ' || TO_CHAR(end_date, 'MM/DD/YYYY')
                WHEN value_type = 'specific' THEN 
                    TO_CHAR(init_date, 'MM/DD/YYYY')
				ELSE
					''
            END) OVER (PARTITION BY f.id)
			) 
    ) AS drop_dates,
	f.production_id,
	io.payer_id,
	f.status,
	f.media,
	f.advertiser,
	f.impressions
from flights f
inner join productions p on f.production_id  = p.id 
inner join insertion_orders io on f.insertion_order_id = io.id 
inner join payers y on io.payer_id  = y.id
left join flight_dates fd on fd.flight_id = f.id and fd.deleted_at is null
where f.deleted_at is null and io.deleted_at is null and p.deleted_at is null and y.deleted_at is null;


CREATE OR REPLACE VIEW public.view_collection_bills
AS SELECT DISTINCT b.id,
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
    b.balance
   FROM bills b
     JOIN flights f ON f.bill_id = b.id
     JOIN invoices i ON i.id = f.invoice_id
     JOIN productions p ON b.production_id = p.id
     JOIN payers y ON i.payer_id = y.id
  WHERE p.production_billing_type::text = 'collection'::text;


DROP VIEW IF EXISTS view_billing_bills;
create or replace view view_billing_bills
as
select distinct
   b.id,
   to_char(b.due_date, 'Month') as bill_month,
   b.identifier as  b_identifier,
   to_char(b.due_date, 'MM/DD/YYYY') as due_date,
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
