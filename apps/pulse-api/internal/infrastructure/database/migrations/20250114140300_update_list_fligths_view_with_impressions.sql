-- +goose Up
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
                    TO_CHAR(init_date, 'DD/MM/YYYY') || ' - ' || TO_CHAR(end_date, 'DD/MM/YYYY')
                WHEN value_type = 'specific' THEN 
                    TO_CHAR(init_date, 'DD/MM/YYYY')
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
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
