DROP FUNCTION IF EXISTS get_overview_summary(p_from date, p_to date);
CREATE OR REPLACE FUNCTION get_overview_summary(p_from date, p_to date)
 RETURNS TABLE(revenue numeric(10,2), gross_margin numeric(10,1), dso numeric(10,2), dpo numeric(10,2))
 LANGUAGE sql
AS $$
WITH  calculate_interval as (
  select age(p_to, p_from) as a
), 
cte_net_amounts as(
  select i.id, i.amount 
  from invoices i 
  where i.invoiced_date between p_from and p_to and i.status = 'paid'
),
cte_net_amounts_overall as(
  select SUM(i.amount) as net_revenue 
  from invoices i 
  where i.invoiced_date between p_from and p_to and i.status <> 'draft'
),
cte_net_amount_by_invoices as (
  select sum(amount) as amount
  from cte_net_amounts
),
cte_expenses as (
  select sum(total_deduction) as expense from expenses  cross join calculate_interval ci
  where deleted_at is null and TO_DATE('01/'|| LPAD(month, 2, '0') || '/' ||year, 'DD/MM/YYYY') BETWEEN date_trunc(case WHEN ci.a > interval '1 year' then 'year' else 'month' end, p_from) and p_to
),
cte_total_revenue as (
  select (na.amount - e.expense)::numeric(10,2) as net_revenue from cte_net_amount_by_invoices na, cte_expenses e
),
cte_total_collection_paid as (
  select sum(b.revenue) as total 
  from bills b 
  inner join (SELECT 
		        bill_id,
		        MAX(payment_at) AS last_payment_date
		    FROM 
		        bill_payments
		    GROUP BY 
		        bill_id) lbp on b.id = lbp.bill_id
  inner join productions p on b.production_id = p.id 
  where b.status = 'paid' and lbp.last_payment_date between p_from and p_to and lower(p.production_billing_type) = 'collection' 
),
cte_total_billing_invoice as (
  select sum(b.revenue) as total 
  from bills b 
  inner join productions p on b.production_id = p.id 
  where b.due_date between p_from and p_to and lower(p.production_billing_type) = 'billing' 
),
cte_net_profit as (
	select sum(b.revenue) as total 
  	from bills b 
  	where b.due_date between p_from and p_to
),
cte_net_amounts_overall_after_applied_expenses as (
  select t.net_revenue - e.expense as net_revenue
  from cte_net_amounts_overall t, cte_expenses e
),
cte_gross_margin as (
	select (case 
	when t.net_revenue - p.total < 0 then 0 
	when t.net_revenue > 0 then (t.net_revenue - p.total) /t.net_revenue * 100 
	else 0 end)::numeric(10,1) as percent from cte_net_amounts_overall_after_applied_expenses t, cte_net_profit p
), 
cte_days_to_collect_invoice_paid as (
	select (EXTRACT(EPOCH FROM AVG(AGE(ip.last_payment_date, i.invoiced_date))) /86400)::numeric(10,2) as avg_days
	from invoices i inner join (
		SELECT invoice_id, MAX(paid_at) AS last_payment_date
		FROM invoice_payments
		GROUP BY invoice_id
	) ip on i.id = ip.invoice_id
	where i.status = 'paid' and ip.last_payment_date between p_from and p_to
), 
cte_days_to_collect_bills_paid as (
	select (EXTRACT(EPOCH FROM AVG(AGE(bp.last_payment_date, b.created_at))) /86400)::numeric(10,2) as avg_days
	from bills b inner join (
		SELECT bill_id, MAX(payment_at) AS last_payment_date
		FROM bill_payments
		GROUP BY bill_id
	) bp on b.id = bp.bill_id
	where b.status = 'paid' and bp.last_payment_date between p_from and p_to
)
select case when r.net_revenue is null or r.net_revenue < 0 then 0 else r.net_revenue end, gm.percent, case when ip.avg_days is null then 0 else ip.avg_days end, case when bp.avg_days is null then 0 else bp.avg_days end from cte_total_revenue r, cte_gross_margin gm, cte_days_to_collect_invoice_paid ip, cte_days_to_collect_bills_paid bp;
$$;