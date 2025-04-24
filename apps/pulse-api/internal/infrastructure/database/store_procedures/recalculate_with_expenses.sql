drop function if exists recalculate_with_expenses(
			p_production_id INTEGER,
			p_month text,
			p_year text,
			p_user_id integer
		);

CREATE OR REPLACE FUNCTION recalculate_with_expenses(
			p_production_id INTEGER,
			p_month text,
			p_year text,
			p_user_id integer
		)  
		RETURNS void as
		$$
		DECLARE
			_id INTEGER;
			_bill record;
			_deduction numeric;
			_applied_retention numeric;
			_amount numeric;
			_revenue numeric;
			_paid numeric;
			_retention numeric;
			_ii_amount numeric;
		BEGIN
			RAISE NOTICE 'Starting to recalculate expense';
			
			_applied_retention := SUM(b.retention) FROM bills b WHERE b.status = 'paid' and b.production_id = p_production_id 
							 and date_part('month', b.due_date) = cast(p_month as integer) AND date_part('year', b.due_date) = cast(p_year as integer);

			if _applied_retention > 0 then
				raise exception  'You cannot add or modify expenses at %/% because a payment has been made on bills with retention.', p_month, p_year;
			end if;		

			RAISE NOTICE 'Get pending expense to apply, current applied %', _applied_retention;

			_deduction := SUM(e.total_deduction) FROM expenses e WHERE e.production_id = p_production_id and e.deleted_at is null
							AND e.month = p_month
							AND e.year = p_year;	
			
			if _deduction is null or _deduction = 0 then 
				return;
			end if;
	
			-- has billing
			for _bill in select b.*, p.production_split as split, p.production_expense_discount_type as discount_type from bills b join productions p ON b.production_id = p.id
				where b.production_id = p_production_id and b.status <> 'paid'
				and b.due_date is not null and date_part('month', b.due_date) = cast(p_month as integer) AND date_part('year', b.due_date) = cast(p_year as integer)
				order by b.id asc
			LOOP
				raise notice 're-calculating bill %', _bill;
				_ii_amount := SUM(f.total_cost) FROM flights f WHERE f.bill_id = _bill.id;
				raise notice 're-calculating add deduction %', _deduction;
				_amount := _ii_amount * _bill.split / 100;
				
				_paid := _bill.revenue - _bill.balance;

				if _paid is null then
				   _paid = 0;
				end if;
 
				if _amount is null then 
					_amount := 0;
				end if; 

				_retention := case when _bill.discount_type ilike 'before%' then _deduction * _bill.split / 100 else _deduction end;
				
                if _retention > _amount - _paid then
				   _retention = _amount - _paid;
                end if;

				_revenue := _amount - _retention;
				
				UPDATE bills SET
					amount = case when _amount is null then 0 else _amount::numeric(10,2) end,
					revenue = case when _revenue is null or _revenue < 0 then 0 else _revenue::numeric(10,2) end,
					balance = case when _revenue is null or _revenue < 0 then 0 else (_revenue - _paid)::numeric(10,2) end,
					retention = case when _retention is null then 0 else _retention::numeric(10,2) end,
					change_by = p_user_id::text
					WHERE id = _bill.id;
				_deduction := _deduction - _retention;
			end loop;
		END;
		$$ LANGUAGE plpgsql;