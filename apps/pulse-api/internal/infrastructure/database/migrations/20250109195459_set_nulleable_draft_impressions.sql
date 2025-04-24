-- +goose Up
ALTER TABLE io_drafts ALTER COLUMN io_total_io_impressions DROP NOT NULL;
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
