-- +goose Up
alter TABLE bill_payments add COLUMN if not EXISTS payment_month_at timestamp not null default date_trunc('month',now() at time zone 'utc'::text);
alter TABLE bill_payments add COLUMN if not EXISTS payment_week_at timestamp not null default date_trunc('week',now() at time zone 'utc'::text);

update bill_payments set payment_month_at = date_trunc('month', payment_at), payment_week_at = date_trunc('week', payment_at);

alter TABLE bills add COLUMN if not EXISTS created_month_at timestamp not null default date_trunc('month',now() at time zone 'utc'::text);
alter TABLE bills add COLUMN if not EXISTS created_week_at timestamp not null default date_trunc('week',now() at time zone 'utc'::text);

update bills set created_month_at = date_trunc('month', created_at), created_week_at = date_trunc('week', created_at);

-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
