-- +goose Up
DROP VIEW IF EXISTS view_expenses;
DROP TABLE IF EXISTS expense_items;
ALTER TABLE expenses ADD COLUMN total_deduction DECIMAL(10,2) NOT NULL DEFAULT 0;

create or replace view view_expenses as
select 
	e.id,
	e.production_id,
	p.entity_name as production_name,
	total_deduction as total_amount,
	e.month,
	e.year
from expenses e 
inner join productions p on e.production_id = p.id 
where e.deleted_at is null and p.deleted_at is null
group by e.id,
	e.production_id,
	p.entity_name,
	e."month",
	e."year";
	
UPDATE expenses SET total_deduction = ROUND((RANDOM() * (100000.00 - 1000.00) + 1000.00)::numeric, 2)
WHERE total_deduction = 0;
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
CREATE TABLE IF NOT EXISTS expense_items (
	id SERIAL PRIMARY KEY,
	expense_id INT NOT NULL REFERENCES expenses(id),
	category VARCHAR(255) NOT NULL,
	amount DECIMAL (10, 2) NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP
);
ALTER TABLE expenses DROP COLUMN total_deduction;
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
