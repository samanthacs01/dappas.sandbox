-- +goose Up
alter table flights add column if not exists media varchar(255) not null default '';
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
        SELECT 
            CASE 
                WHEN value_type = 'range' THEN 
                    TO_CHAR(init_date, 'DD/MM/YYYY') || ' - ' || TO_CHAR(end_date, 'DD/MM/YYYY')
                WHEN value_type = 'specific' THEN 
                    TO_CHAR(init_date, 'DD/MM/YYYY')
				ELSE
					''
            END
        FROM flight_dates fd
        WHERE fd.flight_id = f.id
    ) AS drop_dates,
	f.production_id,
	io.payer_id,
	f.status,
	f.media,
	f.advertiser
from flights f
inner join productions p on f.production_id  = p.id 
inner join insertion_orders io on f.insertion_order_id = io.id 
inner join payers y on io.payer_id  = y.id
where f.deleted_at is null and io.deleted_at is null and p.deleted_at is null and y.deleted_at is null;

drop view if exists view_insertion_orders;
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
