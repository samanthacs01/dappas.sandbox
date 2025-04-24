-- +goose Up
update productions set 
	production_billing_type = lower(production_billing_type),
	production_expense_discount_type = lower(production_expense_discount_type);
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';	
-- +goose StatementEnd
