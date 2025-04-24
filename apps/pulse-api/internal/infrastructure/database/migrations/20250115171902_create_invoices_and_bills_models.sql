-- +goose Up
create table if not exists invoices (
	id serial primary key,
	identifier text not null,
	created_at timestamp default (now() at time zone 'utc'),
	updated_at timestamp default (now() at time zone 'utc'),
	deleted_at timestamp default null,
	due_date date not null,
	invoiced_date date not null,
	insertion_order_id integer not null REFERENCES insertion_orders(id),
	payer_id integer not null references payers(id),
	amount numeric(10, 4) not null,
	balance numeric(10, 4) not null,
	status text not null default 'draft'
);
create table if not exists invoice_items (
	id serial primary key,
	identifier text not null,
	created_at timestamp default (now() at time zone 'utc'),
	updated_at timestamp default (now() at time zone 'utc'),
	deleted_at timestamp default null,
	invoice_id integer not null REFERENCES invoices(id),
	flight_id integer not null REFERENCES flights(id),
	production_id integer not null references productions(id),
	amount numeric(10, 4) not null,
	status text not null default 'draft'
);

-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
