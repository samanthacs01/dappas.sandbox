package migrations

import (
	"context"
	"database/sql"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upFixIssueWithPercentOnGetBookingKpi, downFixIssueWithPercentOnGetBookingKpi)
}

const functionBookingKpi string = `
	CREATE OR REPLACE FUNCTION public.get_booking_kpi(start_date date, end_date date)
		RETURNS record
		LANGUAGE plpgsql
		AS $function$
		DECLARE
			result RECORD;
		BEGIN
			SELECT 
				SUM(case when b.total_orders is null then 0 else b.total_orders END)::INteger as total_booked, 
				case WHEN SUM(b.total_orders) > 0 THEN SUM(b.total_executed_orders)/SUM(b.total_orders) * 100 ELSE 0 END as fulfilment_rate,
				CASE WHEN SUM(p.grand_total) > 0 THEN SUM(total_per_payer) / SUM(p.grand_total) * 100 ELSE 0 END as top5_percentage_of_total,
				CASE WHEN SUM(kpifp.grand_total) > 0 THEN SUM(kpifp.total_per_production) / SUM(kpifp.grand_total) * 100 ELSE 0 END as top5_production_of_total
			INTO result
			FROM
			(
				SELECT DISTINCT booked_date, total_per_payer, grand_total 
				FROM view_booking_payers_kpi
				WHERE booked_date BETWEEN start_date AND end_date
			) p 
			CROSS JOIN (
				SELECT DISTINCT booked_date, total_orders, total_executed_orders 
				FROM view_booking_kpi
				WHERE booked_date BETWEEN start_date AND end_date
			) b
			CROSS JOIN (
				SELECT DISTINCT booked_date, total_per_production, grand_total 
				FROM view_booking_production_kpi
				WHERE booked_date BETWEEN start_date AND end_date
			) kpifp;

			RETURN result;
		END;
		$function$
		;
`

func upFixIssueWithPercentOnGetBookingKpi(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is applied.
	tx.Exec(functionBookingKpi)
	return nil
}

func downFixIssueWithPercentOnGetBookingKpi(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
