DROP FUNCTION IF EXISTS get_production_details_booking_dates(p_id integer, p_from date, p_to date);
CREATE OR REPLACE FUNCTION get_production_details_booking_dates(p_id integer, p_from date, p_to date)
 RETURNS TABLE("grouping" text, grouping_details text, total numeric)
 LANGUAGE sql
AS $$
    with calculate_interval AS (
		select age(p_to, p_from) as a 
	),
	cte_flights_by_dates as ( 
		select
			case
				when ci.a > interval '1 year' then date_trunc('year', f.created_at)::date
			    when ci.a > interval '1 month' then date_trunc('month', f.created_at)::date
				when ci.a > interval '1 week' then date_trunc('week', f.created_at)::date
		     	else f.created_at::date
			end as created,
		   f.total_cost 
		from flights f cross join calculate_interval ci
		where f.production_id = p_id and f.deleted_at is null and f.created_at::date between p_from and p_to
   ),
   cte_time_frames_with_total as (	
	  select tf.grouping, sum(f.total_cost) as total, tf.day as to_order from get_grouping_from_dates(p_from, p_to) tf left join cte_flights_by_dates f
  		on  tf.day = f.created
  		group by tf.grouping, tf.day
	)
	select tft.grouping, tft.grouping as grouping_details, coalesce(tft.total, 0) as total
	from cte_time_frames_with_total tft order by tft.to_order;
$$;