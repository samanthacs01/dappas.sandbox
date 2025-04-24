package migrations

import (
	"context"
	"database/sql"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upUpdateStoreProcedure, downUpdateStoreProcedure)
}

func upUpdateStoreProcedure(ctx context.Context, tx *sql.Tx) error {
	if err := runStoreProcedureDdl(tx, "get_grouping_from_dates.sql"); err != nil {
		return err
	}
	if err := runStoreProcedureDdl(tx, "get_booking_values.sql"); err != nil {
		return err
	}
	if err := runStoreProcedureDdl(tx, "get_net_income_details.sql"); err != nil {
		return err
	}
	if err := runStoreProcedureDdl(tx, "get_overview_general_gross_margin_details.sql"); err != nil {
		return err
	}
	if err := runStoreProcedureDdl(tx, "get_payables_on_time_payment_rate_dates.sql"); err != nil {
		return err
	}
	if err := runStoreProcedureDdl(tx, "get_payables_outstanding_dates.sql"); err != nil {
		return err
	}
	if err := runStoreProcedureDdl(tx, "get_payables_overdue_bills.sql"); err != nil {
		return err
	}
	if err := runStoreProcedureDdl(tx, "get_payables_paid_uncollected_payment_dates.sql"); err != nil {
		return err
	}
	if err := runStoreProcedureDdl(tx, "get_production_details_booking_dates.sql"); err != nil {
		return err
	}
	if err := runStoreProcedureDdl(tx, "get_production_details_revenues_dates.sql"); err != nil {
		return err
	}
	if err := runStoreProcedureDdl(tx, "activity_log.sql"); err != nil {
		return err
	}
	return nil
}

func downUpdateStoreProcedure(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
