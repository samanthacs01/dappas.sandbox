-- +goose Up
create or replace view view_productions  as
 select 
	id, 
	entity_name, 
	random() * 10000 as balance, -- mock data 
	cast (random() * 100 as integer) as dpo,  -- mock data 
	production_billing_type as payment_type
	from productions p where p.deleted_at is null;
	
create or replace view view_payers as
select 
	id, 
	entity_name, 
	entity_address,
	contact_name,
	contact_email,
	contact_phone_number,
	entity_name || '&' || contact_name as search_field
	
	from payers p where p.deleted_at is null;
	
create or replace view view_expenses as
select 
	e.id,
	e.production_id,
	p.entity_name as production_name,
	sum(ei.amount) as total_amount,
	e.month || '/' || e.year as month_year,
	e.year || e.month as month_year_hash
from expenses e 
inner join productions p on e.production_id = p.id 
left join expense_items ei ON e.id = ei.expense_id and ei.deleted_at is null
where e.deleted_at is null and p.deleted_at is null
group  by e.id,
	e.production_id,
	p.entity_name,
	e."month" ,e."year";
	
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
drop view view_productions;
drop view view_payers;
drop view view_expenses;
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
