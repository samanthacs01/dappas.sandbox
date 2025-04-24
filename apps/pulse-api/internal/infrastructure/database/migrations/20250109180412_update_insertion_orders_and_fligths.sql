-- +goose Up
alter table payers add column if not exists identifier varchar(10);
alter table payers add column if not exists io_last_generated int default 0;

alter table insertion_orders drop column if exists advertiser;
alter table insertion_orders drop column if exists payment_terms;
alter table insertion_orders drop column if exists media;
alter table insertion_orders add column if not exists io_draft_id int references io_drafts(id);
alter table flights add column if not exists io_flight_draft_id int;
alter table flights add column if not exists length varchar(100);
alter table flights drop column if exists duration;

WITH updated_payers AS (
    SELECT id, row_number() over(order by id) as i
    FROM payers
    WHERE deleted_at IS NULL
    ORDER BY id
)
UPDATE payers
SET identifier = to_char(up.i, 'FM000')
FROM updated_payers up
WHERE payers.id = up.id;


-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
