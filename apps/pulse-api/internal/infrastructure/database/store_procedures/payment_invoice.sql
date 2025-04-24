DROP FUNCTION IF EXISTS  payment_invoice(p_id integer, p_amount numeric, p_user_id integer);
CREATE OR REPLACE FUNCTION payment_invoice(p_id integer, p_amount numeric, p_user_id integer)
		RETURNS void
		LANGUAGE plpgsql
		AS $function$
				DECLARE 
					st text;
					pt integer;
					b_deduction numeric;
					b_amount numeric;
					b_revenue numeric;
					b_retention numeric;
					bb record;
				BEGIN
					RAISE NOTICE 'Starting';
					insert into invoice_payments(invoice_id, amount, change_by)
					values (p_id, p_amount, p_user_id::text);
					
					update invoices 
						set status = case when balance - p_amount > 0 then 'partial_paid' else 'paid' end,
							balance = case when balance - p_amount < 0 then 0 else balance - p_amount end,
							change_by = p_user_id::text 
					where id = p_id;

					select status::text into st
					from invoices where id = p_id;

					if st = 'paid' then
						for bb in select distinct b.identifier, p.id, f.bill_id, f.total_cost as amount, p.production_expense_discount_type as discount_type, p.production_split as split, net_payment_terms 
							from flights f
							inner join productions p on f.production_id = p.id 
							inner join bills b on f.bill_id = b.id 
							where f.invoice_id = p_id and p.production_billing_type = 'collection'
							order by b.identifier desc
						LOOP 
						b_deduction := (SELECT SUM(e.total_deduction) FROM expenses e WHERE e.production_id = bb.id and e.deleted_at is null
							AND CAST(e.month as INTEGER) = date_part('month', CURRENT_DATE + INTERVAL '1 day' * bb.net_payment_terms) 
							AND CAST(e.year as INTEGER) = date_part('year', CURRENT_DATE + INTERVAL '1 day' * bb.net_payment_terms)) 
							- (SELECT SUM(b.retention) FROM bills b JOIN productions p on b.production_id = p.id and b.deleted_at is null
								WHERE p.production_billing_type = 'collection' AND  date_part('month', b.due_date)  = date_part('month', CURRENT_DATE + INTERVAL '1 day' * bb.net_payment_terms) 
								AND date_part('year', b.due_date) = date_part('year', CURRENT_DATE + INTERVAL '1 day' * bb.net_payment_terms));
						if b_deduction is null then 
								b_deduction := 0;
						end if;
							
							b_amount := bb.amount * bb.split / 100;
							if b_amount is null then 
							b_amount := 0;
							end if; 
							b_revenue := case when bb.discount_type ilike 'before%' then (bb.amount - b_deduction) * bb.split / 100 else b_amount - b_deduction end;
							b_retention := case when bb.discount_type ilike 'before%' then b_amount - (bb.amount - b_deduction) * bb.split / 100 else b_deduction end;
							UPDATE bills b SET
								revenue = case when b_revenue is null or b_revenue < 0 then 0 else b_revenue end,
								balance = case when b_revenue is null or b_revenue < 0 then 0 else b_revenue end,
								retention = case when b_retention is null then 0 else b_retention end,
								due_date = CURRENT_DATE + INTERVAL '1 day' * bb.net_payment_terms,
								change_by = p_user_id::text
							WHERE b.id = bb.bill_id;
						
						END LOOP;
					end if; 
				END;
				$function$;