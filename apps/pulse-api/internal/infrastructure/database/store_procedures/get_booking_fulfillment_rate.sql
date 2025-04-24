DROP FUNCTION IF EXISTS get_booking_fulfillment_rate(p_from date, p_to date);
CREATE OR REPLACE FUNCTION get_booking_fulfillment_rate(p_from date, p_to date)
 RETURNS TABLE("grouping" text, total numeric)
 LANGUAGE sql
AS $$
 with cte_fulfillment as (
			select sum(total_executed_orders)  as total_executed_orders
			from view_booking_kpi
			where booked_date between p_from and p_to

		),
		total_booked as (
			select sum(total_orders) as total_orders
			from view_booking_kpi
			where booked_date between p_from and p_to
		),
		percents as (
			select 
				(case when total_orders > 0 then total_executed_orders / total_orders * 100 else 0 end)::numeric(10,2) as percent_ff,
				(case when total_orders > 0 then (total_orders - total_executed_orders) / total_orders * 100 else 0 end)::numeric(10,2) as percent_nff
			from cte_fulfillment, total_booked
		)
		select 'Executed Orders' as grouping, percent_ff as total
		from percents
		union
		select 'Not Invoiced Orders' as grouping, percent_nff as total
		from percents;
$$;