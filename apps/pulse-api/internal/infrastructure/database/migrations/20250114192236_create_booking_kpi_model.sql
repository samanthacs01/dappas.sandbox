-- +goose Up
alter table insertion_orders add column if not exists executed boolean default false;
alter table insertion_orders alter column created_at set default (now() at time zone 'utc');
alter table insertion_orders alter column updated_at set default (now() at time zone 'utc');

create or replace view view_booking_kpi as 
		select 
		created_at::date as booked_date,
		COUNT (distinct id) as total_orders,
		SUM(CASE WHEN executed THEN 1 ELSE 0 END) as total_executed_orders
		FROM insertion_orders 
		GROUP BY booked_date;

create or replace view view_booking_payers_kpi as 
	WITH PayersByDates AS (
		SELECT
			p.entity_name as payer,
			p.id as payer_id,
			kpi.created_at::date AS booked_date,
			kpi.net_total_io_cost as total 
		FROM
			insertion_orders kpi INNER JOIN payers p ON kpi.payer_id = p.id
	),
	 PayerTotals AS (
		SELECT
			p.payer,
			p.payer_id,
			p.booked_date,
			SUM(total) AS total_per_payer
		FROM
			PayersByDates p
		GROUP BY
			p.payer_id, p.payer, p.booked_date
	),
	Top5Payers AS (
		SELECT
			payer_id,
			SUM(total_per_payer) AS total_sum
		FROM
			PayerTotals
		GROUP BY
			payer_id
		ORDER BY
			total_sum DESC
		LIMIT 5
	),
	TotalSum AS (
		SELECT
			SUM(total_per_payer) AS grand_total
		FROM
			PayerTotals
	),
	Top5Total AS (
		SELECT
			SUM(tp.total_sum) AS top5_total_sum
		FROM
			Top5Payers tp
	)
	SELECT
		pt.payer_id,
		pt.payer,
		pt.booked_date,
		t5.top5_total_sum as total_per_payer,
		(pt.total_per_payer / ts.grand_total) * 100 AS percentage_of_total,
		(t5.top5_total_sum / ts.grand_total) * 100 AS top5_percentage_of_total,
		ts.grand_total 
	FROM
		PayerTotals pt
	JOIN
		Top5Payers tp ON pt.payer_id = tp.payer_id
	CROSS JOIN
		TotalSum ts
	CROSS JOIN
		Top5Total t5
	ORDER BY
		pt.booked_date, pt.payer_id;

create or replace view view_booking_production_kpi as 
	WITH ProductionByDates AS (
		SELECT
			p.entity_name as production,
			p.id as production_id,
			kpi.created_at::date AS booked_date,
			kpif.total_cost as total
		FROM
			insertion_orders kpi 
		INNER JOIN flights kpif ON kpif.production_id = kpi.id
		INNER JOIN productions p ON kpif.production_id = p.id
	),
	ProductionTotals AS (
		SELECT
			p.production,
			p.production_id,
			p.booked_date,
			SUM(total) AS total_per_production
		FROM
			ProductionByDates p
		GROUP BY
			p.production_id, p.production, p.booked_date
	),
	Top5Productions AS (
		SELECT
			production_id,
			SUM(total_per_production) AS total_sum
		FROM
			ProductionTotals
		GROUP BY
			production_id
		ORDER BY
			total_sum DESC
		LIMIT 5
	),
	TotalSum AS (
		SELECT
			SUM(total_per_production) AS grand_total
		FROM
			ProductionTotals
	),
	Top5Total AS (
		SELECT
			SUM(tp.total_sum) AS top5_total_sum
		FROM
			Top5Productions tp
	)
	SELECT
		pt.production_id,
		pt.production,
		pt.booked_date,
		t5.top5_total_sum as total_per_production,
		(pt.total_per_production / ts.grand_total) * 100 AS percentage_of_total,
		(t5.top5_total_sum / ts.grand_total) * 100 AS top5_percentage_of_total,
		ts.grand_total
	FROM
		ProductionTotals pt
	JOIN
		Top5Productions tp ON pt.production_id = tp.production_id
	CROSS JOIN
		TotalSum ts
	CROSS JOIN
		Top5Total t5
	ORDER BY	
		pt.booked_date, pt.production_id;

-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
