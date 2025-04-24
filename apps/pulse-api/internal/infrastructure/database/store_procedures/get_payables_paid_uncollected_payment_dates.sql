DROP FUNCTION IF EXISTS get_payables_paid_uncollected_payment_dates(p_from date, p_to date);
CREATE OR REPLACE FUNCTION get_payables_paid_uncollected_payment_dates(p_from date, p_to date)
 RETURNS TABLE("grouping" text, grouping_details text, total numeric)
 LANGUAGE sql
AS $$
  with calculate_interval AS (
		select age(p_to, p_from) as a
	),
	cte_bills_by_dates as ( 
		select 
			case 
			    when ci.a > '1 year' then date_trunc('year', b.created_month_at)
				when ci.a > '1 month' then b.created_month_at
				when ci.a > '1 week' then b.created_week_at
				else b.created_at
			end as created,
			b.balance 
		from bills b cross join calculate_interval ci
		where b.deleted_at is null and b.created_at::date between p_from and p_to and b.status <> 'paid'
  ),
  cte_time_frames_with_total as (	
	  	select 
			tf.grouping, 
			sum(case when b.balance = null then 0 else b.balance end) as total, 
			tf.day as to_order
		from get_grouping_from_dates(p_from, p_to) tf 
		left join cte_bills_by_dates b
  		on tf.day = b.created
  		group by tf.grouping, tf.day
	)
	select tft.grouping, tft.grouping as grouping_details, coalesce(tft.total, 0) as total
	from cte_time_frames_with_total tft order by tft.to_order;
$$;