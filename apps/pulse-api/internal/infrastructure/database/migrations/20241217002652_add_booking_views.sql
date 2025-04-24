-- +goose Up
create or replace view view_insertion_orders as
select 
	io.id,
	io."number",
	p.entity_name as payer,
	io.net_total_io_cost,
	io.gross_total_io_cost, 
	io.total_io_impressions,
	io.status,
	io.payer_id,
	io.created_at
from insertion_orders io 
inner join payers p on io.payer_id = p.id 
where p.deleted_at is null and io.deleted_at is null;

create or replace view view_flights as
select 
	f.id,
	f.identifier,
	io.number as insertion_order,
	y.entity_name as payer,
	p.entity_name as production,
	f.total_cost,
	'(' || to_char(f.start_date, 'DD/MM/YY') || ',' || to_char(f.end_date, 'DD/MM/YY') || ')' as drop_date,
	f.production_id,
	io.payer_id,
	f.status,
	f.start_date,
	f.end_date 
from flights f  
inner join productions p on f.production_id  = p.id 
inner join insertion_orders io on f.insertion_order_id = io.id 
inner join payers y on io.payer_id  = y.id
where f.deleted_at is null and io.deleted_at is null and p.deleted_at is null and y.deleted_at is null;

-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
drop view view_insertion_orders;
drop view view_flights;
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd