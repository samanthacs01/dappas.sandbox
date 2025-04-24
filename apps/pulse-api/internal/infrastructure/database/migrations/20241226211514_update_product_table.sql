-- +goose Up
ALTER TABLE productions ADD COLUMN IF NOT EXISTS contract_file_path VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE productions ADD COLUMN IF NOT EXISTS net_payment_terms INT NOT NULL DEFAULT 0;
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
ALTER TABLE productions DROP COLUMN IF EXISTS contract_file_path;
ALTER TABLE productions DROP COLUMN IF EXISTS net_payment_terms;
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
