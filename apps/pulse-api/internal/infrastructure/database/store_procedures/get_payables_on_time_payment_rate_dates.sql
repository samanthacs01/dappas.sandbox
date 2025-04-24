DROP FUNCTION IF EXISTS get_payables_on_time_payment_rate_dates(p_from date, p_to date);
CREATE OR REPLACE FUNCTION get_payables_on_time_payment_rate_dates(p_from date, p_to date)
 RETURNS TABLE("grouping" text, "grouping_details" text, total numeric, "order" date)
 LANGUAGE sql
AS $$
   WITH cte_calculate_interval AS (
		SELECT age(p_to, p_from) AS _a
   ),
   cte_grouping_dates AS (
		SELECT * FROM get_grouping_from_dates(p_from, p_to)
   ),
   cte_paid_bills_by_dates AS (
		SELECT ip.last_payment_date::date AS paid_at, 
			   b.revenue 	 
		FROM bills b
		INNER JOIN (
			SELECT 
				bill_id,
				MAX(CASE 
					WHEN ci._a > interval '1 year' THEN date_trunc('year', payment_month_at)
					WHEN ci._a > interval '1 month' THEN payment_month_at
					WHEN ci._a > interval '1 week' THEN payment_week_at
					ELSE payment_at
				END) AS last_payment_date
			FROM 
				bill_payments CROSS JOIN cte_calculate_interval ci
			GROUP BY 
				bill_id
		) ip ON b.id = ip.bill_id 
		WHERE b.deleted_at IS NULL 
		  AND ip.last_payment_date::date BETWEEN p_from AND p_to 
		  AND b.status = 'paid' 
		  AND ip.last_payment_date::date <= b.due_date::date
   ),
   cte_unpaid_bills_by_dates AS (
		SELECT 
			CASE 
			    WHEN ci._a > interval '1 year' THEN date_trunc('year', due_date)
				WHEN ci._a > interval '1 month' THEN date_trunc('month', due_date)
				WHEN ci._a > interval '1 week' THEN date_trunc('week', due_date)
				ELSE b.due_date
			END AS due_date, 
			b.balance 	 
		FROM bills b CROSS JOIN cte_calculate_interval ci
		WHERE b.due_date::date <= p_to 
		  AND status <> 'paid'
   ),	
   cte_time_frames_with_total AS (	
		SELECT tf.grouping, 
			   SUM(CASE WHEN b.revenue IS NULL THEN 0 ELSE b.revenue END) AS total, 
			   tf.day as to_order 
		FROM cte_grouping_dates tf 
		LEFT JOIN cte_paid_bills_by_dates b
			ON tf.day = b.paid_at
		GROUP BY tf.grouping, tf.day
   ),
   cte_time_frames_with_total_unpaid AS (	
		SELECT tf.grouping, 
			   SUM(CASE WHEN b.balance IS NULL THEN 0 ELSE b.balance END) AS total, 
			   tf.day as to_order 
		FROM cte_grouping_dates tf 
		LEFT JOIN cte_unpaid_bills_by_dates b
			ON tf.day = b.due_date 
		GROUP BY tf.grouping, tf.day
   ),
   cte_select_union AS (
		SELECT 'Bills paid on time' AS grouping, 
			   tft.grouping AS grouping_details, 
			   COALESCE(tft.total, 0) AS total, 
			   to_order 
		FROM cte_time_frames_with_total tft
		UNION ALL
		SELECT 'Bills due unpaid' AS grouping, 
			   tftu.grouping AS grouping_details, 
			   COALESCE(tftu.total, 0) AS total, 
			   to_order 
		FROM cte_time_frames_with_total_unpaid tftu
   )
   SELECT cu.grouping, cu.grouping_details, cu.total, cu.to_order 
   FROM cte_select_union cu 
   ORDER BY to_order;
$$;