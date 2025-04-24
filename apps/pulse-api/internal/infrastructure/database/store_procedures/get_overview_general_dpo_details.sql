DROP FUNCTION IF EXISTS get_overview_general_dpo_details(p_from date, p_to date);
CREATE OR REPLACE FUNCTION get_overview_general_dpo_details(p_from date, p_to date)
 RETURNS TABLE("grouping" text, "grouping_details" text, total numeric(10,2), compose numeric(10,2))
 LANGUAGE sql
AS $$
WITH cte_bills AS (
  select AGE(bp.last_payment_date, b.created_at) as paid_after, b.production_id, p.entity_name as production
	from bills b 
	 inner join productions p on b.production_id = p.id		
     inner join (
		SELECT bill_id, MAX(payment_at) AS last_payment_date
		FROM bill_payments
		GROUP BY bill_id
	) bp on b.id = bp.bill_id
	where b.status = 'paid' and bp.last_payment_date between p_from and p_to
),
cte_overall_avg_bills as (
  select (EXTRACT(EPOCH FROM AVG(paid_after)) /86400)::numeric(10,2) as avg_overall_days
	from cte_bills
)
select distinct i.production as "grouping", i.production as "grouping_details", 
	(EXTRACT(EPOCH FROM AVG(i.paid_after) over(partition by i.production_id))/86400)::numeric(10,2) as total, avg_overall_days
 as compose 
from cte_bills i, cte_overall_avg_bills
$$;

