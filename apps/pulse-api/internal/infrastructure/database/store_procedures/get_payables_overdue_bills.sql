DROP FUNCTION IF EXISTS get_payables_overdue_bills(p_from date, p_to date);
CREATE OR REPLACE FUNCTION get_payables_overdue_bills(p_from date, p_to date)
 RETURNS TABLE("grouping" text, "grouping_details" text, total numeric, "order" date)
 LANGUAGE sql
AS $$
  with unpaid_bills_productions as (
		select 
		b.id, b.production_id, p.entity_name as production, b.balance, b.due_date
		from bills b join productions p on b.production_id = p.id
		where b.created_at::date between p_from and p_to
		and b.status <> 'paid'
	),
	unpaid_current_top5_productions_items as ( 
	   select production_id from unpaid_bills_productions p
	   where p.due_date > CURRENT_DATE
	   group by p.production_id
	   order by sum(p.balance) desc
	   limit 5
	),
	unpaid_current_top5_productions as (
		select p.production, sum(p.balance) as total, CURRENT_DATE as to_order
		from unpaid_bills_productions p inner join unpaid_current_top5_productions_items t5 on p.production_id = t5.production_id
		where p.due_date > CURRENT_DATE
        GROUP by p.production
		union 
		select 'Others' as production, sum(balance) as total, CURRENT_DATE as to_order
		from unpaid_bills_productions p
		where  p.due_date > CURRENT_DATE AND production_id not in (select t5.production_id from unpaid_current_top5_productions_items t5)
	),
	unpaid_0_30_top5_productions_items as ( 
	   select production_id from unpaid_bills_productions p
	   where p.due_date between CURRENT_DATE - interval '30 day' and CURRENT_DATE
	   group by p.production_id
	   order by sum(p.balance) desc
	   limit 5
	),
	unpaid_0_30_top5_productions as (
		select p.production, sum(p.balance) as total, CURRENT_DATE - interval '30 day' as to_order
		from unpaid_bills_productions p inner join unpaid_0_30_top5_productions_items t5 on p.production_id = t5.production_id
		where p.due_date between CURRENT_DATE - interval '30 day' and CURRENT_DATE
        GROUP by p.production
		union 
		select 'Others' as production, sum(balance) as total, CURRENT_DATE - interval '30 day' as to_order
		from unpaid_bills_productions p
		where  p.due_date between CURRENT_DATE - interval '30 day' and CURRENT_DATE aND  production_id not in (
			select t5.production_id from unpaid_0_30_top5_productions_items t5
		)
	),
	unpaid_31_60_top5_productions_items as ( 
	   select production_id from unpaid_bills_productions p
	   where p.due_date between CURRENT_DATE - interval '60 day' and CURRENT_DATE - interval '31 day'
	   group by p.production_id
	   order by sum(p.balance) desc
	   limit 5
	),
	unpaid_31_60_top5_productions as (
		select p.production, sum(p.balance) as total, CURRENT_DATE - interval '60 day' as to_order
		from unpaid_bills_productions p inner join unpaid_31_60_top5_productions_items t5 on p.production_id = t5.production_id
		where p.due_date between CURRENT_DATE - interval '60 day' and CURRENT_DATE - interval '31 day'
        GROUP by p.production
		union 
		select 'Others' as production, sum(balance) as total, CURRENT_DATE - interval '60 day' as to_order
		from unpaid_bills_productions p
		where  p.due_date between CURRENT_DATE - interval '60 day' and CURRENT_DATE - interval '31 day' aND  production_id not in (
			select t5.production_id from unpaid_31_60_top5_productions_items t5
		)
	),
	unpaid_61_90_top5_productions_items as ( 
	   select production_id,row_number() over( order by sum(p.balance) desc ) as r from unpaid_bills_productions p
	   where p.due_date between CURRENT_DATE - interval '90 day' and CURRENT_DATE - interval '61 day'
	   group by p.production_id
	   order by sum(p.balance) desc
	   limit 5
	),
	unpaid_61_90_top5_productions as (
		select p.production, sum(p.balance) as total, CURRENT_DATE - interval '90 day' as to_order
		from unpaid_bills_productions p inner join unpaid_61_90_top5_productions_items t5 on p.production_id = t5.production_id
		where p.due_date between CURRENT_DATE - interval '90 day' and CURRENT_DATE - interval '61 day'
        GROUP by p.production
		union 
		select 'Others' as production, sum(balance) as total, CURRENT_DATE - interval '90 day'as to_order
		from unpaid_bills_productions p
		where  p.due_date between CURRENT_DATE - interval '90 day' and CURRENT_DATE - interval '61 day' aND  production_id not in (
			select t5.production_id from unpaid_61_90_top5_productions_items t5
		)
	),
	unpaid_plus_90_top5_productions_items as ( 
	   select production_id from unpaid_bills_productions p
	   where p.due_date < CURRENT_DATE - interval '90 day'
	   group by p.production_id
	   order by sum(p.balance) desc
	   limit 5
	),
	unpaid_plus_90_top5_productions as (
		select p.production, sum(p.balance) as total, CURRENT_DATE - interval '91 day' as to_order
		from unpaid_bills_productions p inner join unpaid_plus_90_top5_productions_items t5 on p.production_id = t5.production_id
		where p.due_date < CURRENT_DATE - interval '90 day'
        GROUP by p.production
		union 
		select 'Others' as production, sum(balance) as total, CURRENT_DATE - interval '91 day' as to_order
		from unpaid_bills_productions p
		where  p.due_date < CURRENT_DATE - interval '90 day' aND  production_id not in (
			select t5.production_id from unpaid_plus_90_top5_productions_items t5
		)
	),
	unions_top5_with_others as (
		select  
		    ct5.to_order,
	        ct5.production as "grouping",
			'Current' as "grouping_details",
		    coalesce(ct5.total, 0) as total
		from unpaid_current_top5_productions ct5
		union
		select
			t5030.to_order,
			t5030.production as "grouping",
			'0-30 Days' as "grouping_details",
			coalesce(t5030.total, 0) as total
		from unpaid_0_30_top5_productions t5030
		union
		select  
			t53160.to_order,
			t53160.production as "grouping", 
			'31-60 Days' as "grouping_details",
			coalesce(t53160.total, 0) as total
		from unpaid_31_60_top5_productions t53160
		union
		select  
			t56190.to_order,
			t56190.production as "grouping",
			'61-90 Days' as "grouping_details",
			coalesce(t56190.total, 0) as total
		from unpaid_61_90_top5_productions t56190
		union
		select  
			t5plus90.to_order,
			t5plus90.production as "grouping", 
			'+90 Days' as "grouping_details",
		    coalesce(t5plus90.total, 0) as total
		from unpaid_plus_90_top5_productions t5plus90
	)
	select "grouping", "grouping_details", total, to_order from unions_top5_with_others order by to_order desc;
$$;
