-- +goose Up
drop view if exists view_io_flight_lists;
create or replace view view_io_flight_lists as
SELECT 
	iof.id, 
	iof.io_draft_id,
	iof.identifier,
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
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
