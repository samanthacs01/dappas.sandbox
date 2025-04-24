DROP FUNCTION IF EXISTS get_production_details_kpi(p_id integer, p_from date, p_to date);
CREATE OR REPLACE FUNCTION get_production_details_kpi(p_id integer, p_from date, p_to date)
 RETURNS TABLE(id integer, booking numeric, net_revenue numeric, next_payment_date date, next_payment_amount numeric, avg_monthly_revenue numeric, percent_variation numeric)
 LANGUAGE sql
AS $$
  	WITH cte_booking_value as (
		SELECT SUM(f.total_cost) as total, p_id as id
		FROM flights f 
		WHERE f.created_at::date BETWEEN p_from AND p_to AND f.deleted_at is null and f.production_id = p_id
  	),
	cte_net_revenue as (
		SELECT SUM(b.revenue) as total, p_id as id
        FROM bills b
		WHERE b.production_id = p_id AND b.due_date BETWEEN p_from AND p_to AND b.deleted_at is null
	),
    cte_next_payment as (
		SELECT b.due_date as next_payment_date, b.balance as next_payment_amount, p_id as id
		FROM bills b
		WHERE b.production_id = p_id AND b.due_date::date >= current_date AND b.status <> 'paid'
		ORDER BY b.due_date desc
		LIMIT 1
	),
	cte_sum_current_month as (
		SELECT sum(b.balance) as total, p_id as id
		FROM bills b
		WHERE b.production_id = p_id AND  date_part('month', b.due_date::date) = date_part('month', current_date)
	),
	cte_sum_previous_month as (
		SELECT sum(b.balance) as total, p_id as id
		FROM bills b
		WHERE b.production_id = p_id AND  date_part('month', b.due_date::date) = date_part('month', current_date - interval '1 Month')
	),
	cte_percent_variation as (
		SELECT 
			case when c.total is null or c.total = 0 then 0 when p.total is null or p.total = 0 then 100.00 else (c.total - p.total) / p.total * 100 end as variation, p_id as id
		FROM cte_sum_current_month c CROSS JOIN cte_sum_previous_month p
	)
	select p.id, case WHEN b.total is null then 0 else b.total end as b_total, case WHEN r.total is null then 0 else r.total end as r_total, n.next_payment_date, case WHEN n.next_payment_amount is null then 0 else n.next_payment_amount end as next_payment_amount, case WHEN c.total is null then 0 else c.total end as c_total, case when pv.variation is null then 0 else pv.variation end as variation	
  from productions p 
  left join cte_booking_value b on p.id = b.id
  left join cte_net_revenue r ON p.id = r.id 
  left join cte_next_payment n ON p.id = n.id
  left join cte_sum_current_month c ON p.id = c.id
  left join cte_percent_variation pv ON p.id = pv.id 
  where p.id = p_id;
$$;