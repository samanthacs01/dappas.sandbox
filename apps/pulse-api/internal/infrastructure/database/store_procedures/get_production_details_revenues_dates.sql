DROP FUNCTION IF EXISTS get_production_details_revenues_dates(p_id integer, p_from date, p_to date);
CREATE OR REPLACE FUNCTION get_production_details_revenues_dates(p_id integer, p_from date, p_to date)
 RETURNS TABLE("grouping" text, grouping_details text, total numeric)
 LANGUAGE sql
AS $$
  	with calculate_interval AS (
		select age(p_to, p_from) as a
	), 
  	cte_bills_by_dates as ( 
		select 
			case 
				when ci.a > interval '1 year' then date_trunc('year', b.due_date)
			    when ci.a > interval '1 month' then date_trunc('month', b.due_date)
				when ci.a > interval '1 week' then date_trunc('week', b.due_date)
				else b.due_date
			end as due_date, b.revenue 
		from bills b cross join calculate_interval ci
		where b.production_id = p_id and b.deleted_at is null and b.due_date::date between p_from and p_to
  	),
  	cte_time_frames_with_total as (	
	  select tf.grouping, sum(b.revenue) as total, tf.day as to_order from get_grouping_from_dates(p_from, p_to) tf left join cte_bills_by_dates b
  		on  tf.day = b.due_date
		group by tf.grouping, tf.day
	)
	select tft.grouping, tft.grouping as grouping_details, coalesce(tft.total, 0) as total
	from cte_time_frames_with_total tft ORDER BY tft.to_order;
$$;