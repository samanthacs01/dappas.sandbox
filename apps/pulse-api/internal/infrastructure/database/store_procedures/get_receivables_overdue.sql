DROP FUNCTION IF EXISTS get_receivables_overdue(p_from date, p_to date);
CREATE OR REPLACE FUNCTION get_receivables_overdue(p_from date, p_to date)
 RETURNS TABLE("grouping" text, "grouping_details" text, total numeric, "order" integer)
 LANGUAGE sql
AS $$
  with unpaid_invoices_payers as (
		select distinct
		i.id, i.payer_id, y.entity_name as payer, i.balance, i.due_date
		from invoices i join payers y on i.payer_id = y.id
		where i.invoiced_date between p_from and p_to
		and i.status =any(array['pending_payment', 'partial_paid'])
	),
	unpaid_current_top5_payer_items as (
		select payer_id from unpaid_invoices_payers
		where due_date > CURRENT_DATE
        GROUP BY payer_id
		ORDER BY SUM(balance) DESC
		LIMIT 5
	),
	unpaid_current_top5_payers as (
		select p.payer, sum(p.balance) as total, 1 as to_order
		from unpaid_invoices_payers p inner join unpaid_current_top5_payer_items t5 ON p.payer_id = t5.payer_id 
		group by p.payer
        union 
    	select 'Others' as payer, sum(p.balance) as total, 1 as to_order
		from unpaid_invoices_payers p
		where p.due_date > CURRENT_DATE and p.payer_id NOT IN (select payer_id from unpaid_current_top5_payer_items )
	),
	unpaid_0_30_top5_payer_items as (
		select payer_id from unpaid_invoices_payers
		where due_date between CURRENT_DATE - interval '30 day' and CURRENT_DATE 
        GROUP BY payer_id
		ORDER BY SUM(balance) DESC
		LIMIT 5
	),
	unpaid_0_30_top5_payers as (
		select p.payer, sum(p.balance) as total, 2 as to_order
		from unpaid_invoices_payers p inner join unpaid_0_30_top5_payer_items t5 ON p.payer_id = t5.payer_id 
		where p.due_date between CURRENT_DATE - interval '30 day' and CURRENT_DATE 
		group by p.payer
        union 
    	select 'Others' as payer, sum(p.balance) as total, 2 as to_order
		from unpaid_invoices_payers p
		where p.due_date between CURRENT_DATE - interval '30 day' and CURRENT_DATE and p.payer_id NOT IN (select payer_id from unpaid_0_30_top5_payer_items )
	),
	unpaid_31_60_top5_payer_items as (
		select payer_id from unpaid_invoices_payers
		where due_date between CURRENT_DATE - interval '60 day' and CURRENT_DATE - interval '31 day'
        GROUP BY payer_id
		ORDER BY SUM(balance) DESC
		LIMIT 5
	),
	unpaid_31_60_top5_payers as (
		select p.payer, sum(p.balance) as total, 3 as to_order
		from unpaid_invoices_payers p inner join unpaid_31_60_top5_payer_items t5 ON p.payer_id = t5.payer_id 
		where due_date between CURRENT_DATE - interval '60 day' and CURRENT_DATE - interval '31 day'
		group by p.payer
        union 
    select 'Others' as payer, sum(p.balance) as total, 3 as to_order
		from unpaid_invoices_payers p
		where p.due_date between CURRENT_DATE - interval '60 day' and CURRENT_DATE - interval '31 day' and p.payer_id NOT IN (select payer_id from unpaid_31_60_top5_payer_items )
	),
	unpaid_61_90_top5_payer_items as (
		select payer_id from unpaid_invoices_payers
		where due_date between CURRENT_DATE - interval '90 day' and CURRENT_DATE - interval '61 day'
        GROUP BY payer_id
		ORDER BY SUM(balance) DESC
		LIMIT 5
	),
	unpaid_61_90_top5_payers as (
		select p.payer, sum(p.balance) as total, 4 as to_order
		from unpaid_invoices_payers p inner join unpaid_61_90_top5_payer_items t5 ON p.payer_id = t5.payer_id 
		where due_date between CURRENT_DATE - interval '90 day' and CURRENT_DATE - interval '61 day'
		group by p.payer
        union 
    	select 'Others' as payer, sum(p.balance) as total, 4 as to_order
		from unpaid_invoices_payers p
		where p.due_date between CURRENT_DATE - interval '90 day' and CURRENT_DATE - interval '61 day' and p.payer_id NOT IN (select payer_id from unpaid_61_90_top5_payer_items )
	),	
	unpaid_plus_90_top5_payer_items as (
		select payer_id from unpaid_invoices_payers
		where due_date < CURRENT_DATE - interval '90 day'
        GROUP BY payer_id
		ORDER BY SUM(balance) DESC
		LIMIT 5
	),
	unpaid_plus_90_top5_payers as (
		select p.payer, sum(p.balance) as total, 5 as to_order
		from unpaid_invoices_payers p inner join unpaid_plus_90_top5_payer_items t5 ON p.payer_id = t5.payer_id 
		where due_date < CURRENT_DATE - interval '90 day'
		group by p.payer
        union 
        select 'Others' as payer, sum(p.balance) as total, 5 as to_order
		from unpaid_invoices_payers p
		where p.due_date between CURRENT_DATE - interval '90 day' and CURRENT_DATE - interval '61 day' and p.payer_id NOT IN (select payer_id from unpaid_plus_90_top5_payer_items )
	),	
	items as (	
		select  
			1 as g_to_order,
      to_order,
			'Current' as name,
			t5.payer,
			coalesce(t5.total,0) as total
		from unpaid_current_top5_payers t5
		union
		select  
			2 as g_to_order,
      to_order,
			'0-30 Days' as name,
			t5.payer,
			coalesce(t5.total,0) as total
		from unpaid_0_30_top5_payers t5
		union
		select  
			3 as g_to_order,
      to_order,
			'31-60 Days' as name,
			t5.payer,
			coalesce(t5.total,0) as total
		from unpaid_31_60_top5_payers t5
		union
		select  
			4 as g_to_order,
      to_order,
			'61-90 Days' as name,
			t5.payer,
			coalesce(t5.total,0) as total
		from unpaid_61_90_top5_payers t5
		union
		select  
			5 as g_to_order,
      to_order,
			'+90 Days' as name,
			t5.payer,
			coalesce(t5.total,0) as total
		from unpaid_plus_90_top5_payers t5
	  )
	select name, payer, total, to_order from items order by g_to_order, to_order
$$;
