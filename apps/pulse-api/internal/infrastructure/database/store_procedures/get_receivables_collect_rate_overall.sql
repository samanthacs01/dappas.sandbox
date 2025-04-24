DROP FUNCTION IF EXISTS get_receivables_collect_rate_overall(p_from date, p_to date);
CREATE OR REPLACE FUNCTION get_receivables_collect_rate_overall(p_from date, p_to date)
 RETURNS TABLE("grouping" text, grouping_details text, total numeric)
 LANGUAGE sql
AS $$
with total_overdue as (
	select SUM(amount) as total FROM invoices WHERE invoiced_date <= p_to AND status <> 'draft'
), 
total_paid as (
  SELECT SUM(i.amount) as total FROM invoices i 
	INNER JOIN (SELECT invoice_id, MAX(paid_at) AS last_payment_date
		FROM invoice_payments GROUP BY invoice_id
  ) ip ON i.id = ip.invoice_id
	where ip.last_payment_date BETWEEN p_from AND p_to AND i.status = 'paid'
),
items as (
	select 'Paid Invoices' as grouping, 'Paid Invoices' as grouping_details, tp.total as it_total FROM total_paid as tp
	union all 
	select 'Unpaid Invoices' as grouping, 'Unpaid Invoices' as grouping_details, ot.total - tp.total as it_total from total_overdue ot, total_paid tp
)
select it.grouping, it.grouping_details, case when t.total is null or t.total = 0 then 0 else (it.it_total/t.total *100)::numeric(10,2) end as total from items it, total_overdue t;
$$;