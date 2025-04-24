DROP FUNCTION IF EXISTS get_overview_general_gross_margin_details(p_from date, p_to date);
CREATE OR REPLACE FUNCTION get_overview_general_gross_margin_details(p_from date, p_to date)
 RETURNS TABLE("grouping" text, "grouping_details" text, total numeric(10,2), "order" date)
 LANGUAGE sql
AS $$
WITH calculate_interval as (
  select age(p_to, p_from) as a
),
cte_months as (
  SELECT generate_series(date_trunc('month', p_from), p_to, '1 month'::interval) as month
),
cte_months_as_groping as (
  select DISTINCT
    to_char(m.month, case when ci.a > interval '1 year' then 'YYYY' else 'Mon, YYYY' end) as inv_month, 
    case when ci.a > interval '1 year' then date_trunc('year', m.month) else m.month end as day
  from cte_months m cross join calculate_interval ci
), 
cte_net_amounts as(
  select i.id, i.amount, case when ci.a > interval '1 year' then date_trunc('year',i.invoiced_date) else date_trunc('month',i.invoiced_date) end as invoiced_date
  from invoices i cross join calculate_interval ci
  where i.invoiced_date between p_from and p_to and i.status <> 'draft'
),
cte_net_amount_by_invoices_grouping as (
  select sum(amount) as amount, na.invoiced_date
  from cte_net_amounts na inner join cte_months_as_groping tf 	
  on na.invoiced_date = tf.day
  group by na.invoiced_date
),
cte_expenses as (
  select total_deduction as expense, TO_DATE('01/'|| (case when ci.a > interval '1 year' then '01' else LPAD(e.month, 2, '0') end) || '/' ||e.year, 'DD/MM/YYYY') as exp_month 
  from expenses e cross join calculate_interval ci
  where e.deleted_at is null and TO_DATE('01/'|| LPAD(month, 2, '0') || '/' ||year, 'DD/MM/YYYY') BETWEEN date_trunc(case WHEN ci.a > interval '1 year' then 'year' else 'month' end, p_from) and p_to
),
cte_sum_expenses as (
	select sum(e.expense) as expense, e.exp_month FROM cte_expenses e INNER JOIN cte_months_as_groping mg ON e.exp_month = mg.day
	group by e.exp_month
),
cte_total_revenue_by_month as (
  select (na.amount - e.expense)::numeric(10,2) as net_revenue, na.invoiced_date 
  from cte_net_amount_by_invoices_grouping na inner join cte_sum_expenses e ON na.invoiced_date = e.exp_month
),
cte_total_billing as (
  select b.revenue as total, case when ci.a > interval '1 year' then date_trunc('year', b.due_date) else date_trunc('month', b.due_date) end as bill_month
  from bills b 
  cross join calculate_interval ci
  where b.due_date between p_from and p_to 
),
cte_sum_total_billing as (
  select SUM(tb.total) as total, tb.bill_month
  from cte_total_billing tb
  GROUP BY tb.bill_month
),
cte_items as (
  SELECT 'Paid to productions' as grouping,  mg.inv_month as grouping_detail, (case when tb.total is null THEN 0 else tb.total end)::numeric(10,2) as total, mg.day as ord
  FROM cte_months_as_groping mg LEFT join cte_sum_total_billing tb ON mg.day = tb.bill_month
  UNION ALL
  SELECT 'Profit' as "grouping", mg.inv_month as grouping_details, (case when rm.net_revenue - tb.total > 0 then rm.net_revenue - tb.total else 0 end )::numeric(10,2) as total, mg.day as ord
  FROM cte_months_as_groping mg LEFT join cte_sum_total_billing tb ON mg.day = tb.bill_month
  LEFT JOIN cte_total_revenue_by_month rm on mg.day = rm.invoiced_date
)
SELECT grouping, grouping_detail, total, ord FROM cte_items ORDER BY ord;
$$;