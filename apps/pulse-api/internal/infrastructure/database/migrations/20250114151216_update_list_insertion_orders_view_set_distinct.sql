-- +goose Up
drop view if exists view_insertion_orders;
create or replace view view_insertion_orders as
select distinct
	io.id,
	io."number",
	p.entity_name as payer,
	io.net_total_io_cost,
	io.gross_total_io_cost, 
	io.total_io_impressions,
	io.status,
	io.payer_id,
	io.created_at,
	io.number || ';' || p.entity_name || ';'  || p.contact_name || ';' || p.contact_email || ';' || p.contact_phone_number as search,
	io.signed_at as signed_date,
	array (select distinct unnest(ARRAY_AGG(f.advertiser) OVER(PARTITION BY p.id))) AS advertisers,
	array (select distinct unnest(ARRAY_AGG(f.media) OVER(PARTITION BY p.id))) as medias
from insertion_orders io 
inner join payers p on io.payer_id = p.id 
left join flights f on f.insertion_order_id = io.id and f.deleted_at is null
where p.deleted_at is null and io.deleted_at is null;
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
