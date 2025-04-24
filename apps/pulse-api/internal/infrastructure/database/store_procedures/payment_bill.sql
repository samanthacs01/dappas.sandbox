CREATE OR REPLACE FUNCTION payment_bill(p_id integer, p_amount numeric, p_user_id integer)
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
					insert into bill_payments(bill_id, amount, change_by)
					values (p_id, p_amount, p_user_id::text);
					
					update bills 
						set status = case when balance - p_amount > 0 then 'partial_paid' else 'paid' end,
							balance = case when balance - p_amount > 0 then balance - p_amount else 0 end,
							change_by = p_user_id::text
					where id = p_id;

				END;
				$function$
				