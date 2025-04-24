package migrations

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upFixBookingKpiDetails, downFixBookingKpiDetails)
}

func upFixBookingKpiDetails(ctx context.Context, tx *sql.Tx) error {
	_, err := tx.Exec("drop function if exists public.get_booking_kpi(start_date date, end_date date);")
	if err != nil {
		fmt.Println("Error dropping function get_booking_kpi: ", err)
		return err
	}
	bookingKpi := `
		CREATE OR REPLACE FUNCTION public.get_booking_kpi(start_date date, end_date date)
			RETURNS table (
				total_booked numeric,
				fulfillment_rate numeric,
				top5_payers_rate numeric,
				top5_production_rate numeric
			)
			LANGUAGE plpgsql
			AS $function$
			DECLARE
				total_booked numeric;
				fulfilment_rate numeric;
				top5_payers_rate numeric;
				top5_production_rate numeric;
			BEGIN
				total_booked := SUM(total_orders)
					FROM view_booking_kpi
					WHERE booked_date BETWEEN start_date AND end_date;
			
				fulfillment_rate := case WHEN SUM(b.total_orders) > 0 THEN SUM(b.total_executed_orders)/SUM(b.total_orders) * 100 ELSE 0 END
					FROM view_booking_kpi b
					WHERE b.booked_date BETWEEN start_date AND end_date;
				
				WITH top5_payers AS (
					SELECT
						p.id as payer_id,
						SUM(f.net_total_io_cost) AS total_sum
					FROM
						insertion_orders f
					INNER JOIN
						payers p ON f.payer_id = p.id
					WHERE f.deleted_at is null and p.deleted_at is null and 
						f.created_at::date BETWEEN start_date AND end_date
					GROUP BY
						p.id
					ORDER BY
						total_sum DESC
					LIMIT 5
				),
				total_payers as (
					SELECT
							SUM(io.net_total_io_cost) AS total_sum
					FROM
							insertion_orders io
					WHERE  io.deleted_at is null and 
							io.created_at::date BETWEEN start_date AND end_date
				),
				total_top5_payers as  (
					SELECT
							SUM(total_sum) AS total_sum
						FROM
							top5_payers
				)
				SELECT case WHEN tp.total_sum > 0 then t5.total_sum / tp.total_sum * 100 else 0 end into top5_payers_rate 
				FROM total_top5_payers t5, total_payers tp;

				WITH top5_productions AS (
					SELECT
						p.id as production_id,
						SUM(f.total_cost) AS total_sum
					FROM
						flights f
					INNER JOIN
						productions p ON f.production_id = p.id
					WHERE f.deleted_at is null and p.deleted_at is null and 
						f.created_at::date BETWEEN start_date AND end_date
					GROUP BY
						p.id
					ORDER BY
						total_sum DESC
					LIMIT 5
				),
				total_productions as (
					SELECT
							SUM(f.total_cost) AS total_sum
					FROM
							flights f
					WHERE  f.deleted_at is null and 
							f.created_at::date BETWEEN start_date AND end_date
				),
				total_top5_productions as  (
					SELECT
							SUM(total_sum) AS total_sum
						FROM
							top5_productions
				)
				SELECT case WHEN tp.total_sum > 0 then t5.total_sum / tp.total_sum * 100 else 0 end into top5_production_rate 
				FROM total_top5_productions t5, total_productions tp;
					
				RETURN query select total_booked, fulfillment_rate, top5_payers_rate, top5_production_rate;
			END;
			$function$
			; 
	`
	_, err = tx.Exec(bookingKpi)
	if err != nil {
		fmt.Println("Error creating function get_booking_kpi: ", err)
	}

	return err
}

func downFixBookingKpiDetails(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
