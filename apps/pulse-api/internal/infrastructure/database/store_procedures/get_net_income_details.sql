DROP FUNCTION IF EXISTS get_net_income_details(p_from date, p_to date);
CREATE OR REPLACE FUNCTION get_net_income_details(p_from date, p_to date)
 RETURNS TABLE("grouping" text, "grouping_details" text, total numeric(10,2))
 LANGUAGE sql
AS $$
WITH calculate_interval as (
  select age(p_to, p_from) as a
),
cte_months as (
  SELECT generate_series(date_trunc('month',p_from), p_to, '1 month'::interval) AS month
),
cte_months_as_groping as (
  select DISTINCT
    to_char(m.month, case when ci.a > interval '1 year' then 'YYYY' else 'Mon, YYYY' end) as inv_month, 
    case when ci.a > interval '1 year' then date_trunc('year', m.month) else m.month end as day
  from cte_months m cross join calculate_interval ci
),
cte_invoices_invoiced_by_month as (
  select i.amount, case when ci.a > interval '1 year' then date_trunc('year',i.invoiced_date) else date_trunc('month',i.invoiced_date) end as invoiced_date
  from invoices i cross join calculate_interval ci
  where i.invoiced_date between p_from and p_to and i.status = 'paid' 
),
cte_sum_invoices_invoiced_by_month as (
  select sum(amount) as total, invoiced_date 
  from cte_invoices_invoiced_by_month
  GROUP by invoiced_date
),
expenses_by_months_int as (
  select e.total_deduction, TO_DATE('01/'|| (case when ci.a > interval '1 year' then '01' else LPAD(e.month, 2, '0') end) || '/' ||e.year, 'DD/MM/YYYY') as exp_month 
  from expenses e cross join calculate_interval ci where deleted_at is null
  and TO_DATE('01/'|| LPAD(month, 2, '0') || '/' ||year, 'DD/MM/YYYY') BETWEEN date_trunc(case WHEN ci.a > interval '1 year' then 'year' else 'month' end, p_from) and p_to
),
expenses_by_months as ( 
  SELECT sum(total_deduction) as total, exp_month
  FROM expenses_by_months_int e INNER JOIN cte_months_as_groping mg ON e.exp_month = mg.day
  GROUP BY exp_month
)
SELECT m.inv_month, m.inv_month as "grouping_details", (case when im.total - em.total > 0 then im.total - em.total else 0 end)::numeric(10,2) as total 
from cte_months_as_groping m left join cte_sum_invoices_invoiced_by_month im on m.day = im.invoiced_date
left join expenses_by_months em on m.day = em.exp_month
ORDER BY m.day;
$$;