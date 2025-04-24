-- +goose Up
drop view if exists view_flights;

alter table io_draft_flights add column if not exists production_id int not null REFERENCES productions(id);
alter table io_draft_flights drop column if exists end_date;
alter table io_draft_flights drop column if exists start_date;

alter table flights drop column if exists end_date;
alter table flights drop column if exists start_date;


create table if not exists io_draft_flight_dates(
	id serial primary key,
	io_draft_flight_id int not null REFERENCES io_draft_flights(id),
	init_date date not null,
	end_date date,
	value_type VARCHAR(50) not null,
	created_at timestamp not null default now(),
	updated_at timestamp not null default now(),
	deleted_at timestamp
);

create table if not exists flight_dates(
	id serial primary key,
	flight_id int not null REFERENCES flights(id),
	init_date date not null,
	end_date date,
	value_type VARCHAR(50) not null,
	created_at timestamp not null default now(),
	updated_at timestamp not null default now(),
	deleted_at timestamp
);

create or replace view view_io_flight_lists as
SELECT 
	iof.id, 
	iof.io_draft_id,
	p.id as production_id, 
	p.entity_name as production_name,
 	iof.ads_type,
	iof.placement,
	iof.duration,
	iof.cpm,
	iof.total_cost,
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
        FROM io_draft_flight_dates iodfd
        WHERE iodfd.io_draft_flight_id = iof.id
    ) AS drop_dates
FROM io_draft_flights iof
left join productions p on iof.production_id = p.id and p.deleted_at is null
where iof.deleted_at is null;


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
	f.status
from flights f
inner join productions p on f.production_id  = p.id 
inner join insertion_orders io on f.insertion_order_id = io.id 
inner join payers y on io.payer_id  = y.id
where f.deleted_at is null and io.deleted_at is null and p.deleted_at is null and y.deleted_at is null;

insert into flight_dates (flight_id, value_type ,init_date, end_date)
select f.id,  
  case 
  		when s.id % 3 = 0 then 'specific'
  		else 'range'
  end as value_type,
  now() - (random() * 30 + 1) * interval '1 day' as init_date,
  case 
  		when s.id % 3 = 0 then null
  		else now() + (random() * 30 + 1) * interval '1 day' 
  end as end_date 
 from flights f 
  cross join generate_series(1, floor(random() * 5 + 1)::integer) as s(id)
order by f.id;

-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
