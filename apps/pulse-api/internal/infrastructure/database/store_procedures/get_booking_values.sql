DROP FUNCTION IF EXISTS get_booking_values(p_from date, p_to date);
CREATE OR REPLACE FUNCTION get_booking_values(p_from date, p_to date)
 RETURNS TABLE("grouping" text, "grouping_details" text, total numeric)
 LANGUAGE sql
AS $$
  with calculate_interval AS (
		select age(p_to, p_from) as a
	),
  cte_booking_dates as (
		select 
      b.total_orders, 
      case 
        when ci.a > interval '1 year' then date_trunc('year', b.booked_date)::date
        when ci.a > interval '1 month' then date_trunc('month', b.booked_date)::date
        when ci.a > interval '1 week' then date_trunc('week', b.booked_date)::date
        else b.booked_date
      end as booked_date
    from view_booking_kpi b cross join calculate_interval ci 
    where b.booked_date between p_from and p_to
	),
  cte_time_frames_with_total as (	
    select tf.grouping, 
      sum(case when b.total_orders = null then 0 else b.total_orders end) as total,
      tf.day as to_order 
    from get_grouping_from_dates(p_from, p_to) tf 
    left join cte_booking_dates b
        on tf.day = b.booked_date 
    group by tf.grouping, tf.day
  )
  select tft.grouping, tft.grouping as grouping_details, coalesce(tft.total, 0) as total from cte_time_frames_with_total tft
  order by tft.to_order
$$;
