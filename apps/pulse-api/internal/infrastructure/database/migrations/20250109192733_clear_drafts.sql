-- +goose Up
delete from io_draft_flight_dates; 
delete from io_draft_flights where io_draft_id in (select id from io_drafts where status <> 'failed');
delete from io_drafts where status <> 'failed' and id not in (select io_draft_id from insertion_orders);
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
