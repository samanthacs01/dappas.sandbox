package migrations

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upFixBookingKpi, downFixBookingKpi)
}

func upFixBookingKpi(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is applied.
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
				
				top5_payers_rate := CASE WHEN SUM(y.grand_total) > 0 THEN SUM(y.total_per_payer) / SUM(y.grand_total) * 100 ELSE 0 END 
					FROM view_booking_payers_kpi y
					WHERE y.booked_date BETWEEN start_date AND end_date;
				top5_production_rate := CASE WHEN SUM(p.grand_total) > 0 THEN SUM(p.total_per_production) / SUM(p.grand_total) * 100 ELSE 0 END
					FROM view_booking_production_kpi p
					WHERE p.booked_date BETWEEN start_date AND end_date;
					
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

func downFixBookingKpi(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
