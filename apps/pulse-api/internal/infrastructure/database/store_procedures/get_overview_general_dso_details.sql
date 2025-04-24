DROP FUNCTION IF EXISTS get_overview_general_dso_details(p_from date, p_to date);
CREATE OR REPLACE FUNCTION get_overview_general_dso_details(p_from date, p_to date)
 RETURNS TABLE("grouping" text, "grouping_details" text, total numeric(10,2), compose numeric(10,2))
 LANGUAGE sql
AS $$
WITH cte_invoices AS (
  SELECT i.id, AGE(ip.last_payment_date, i.invoiced_date) as paid_after, y.entity_name as payer, i.payer_id
  from invoices i 
  inner join payers y on i.payer_id = y.id
  inner join (
		SELECT invoice_id, MAX(paid_at) AS last_payment_date
		FROM invoice_payments
		GROUP BY invoice_id
	) ip on i.id = ip.invoice_id
  where i.status = 'paid' and ip.last_payment_date between p_from and p_to
),
cte_overall_avg_payers as (
  select (EXTRACT(EPOCH FROM AVG(paid_after)) /86400)::numeric(10,2) as avg_overall_days
	from cte_invoices
)
select distinct i.payer as "grouping", i.payer as "grouping_details", 
	(EXTRACT(EPOCH FROM AVG(i.paid_after) over(partition by i.payer_id))/86400)::numeric(10,2) as total, avg_overall_days
 as compose 
from cte_invoices i, cte_overall_avg_payers
$$;
