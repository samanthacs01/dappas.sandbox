package migrations

import (
	"context"
	"database/sql"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upFixOrderOfRanges, downFixOrderOfRanges)
}

func upFixOrderOfRanges(ctx context.Context, tx *sql.Tx) error {
	if err := runStoreProcedureDdl(tx, "get_grouping_from_dates.sql"); err != nil {
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
	if err := runStoreProcedureDdl(tx, "get_receivables_collect_rate_overall.sql"); err != nil {
		return err
	}
	if err := runStoreProcedureDdl(tx, "get_receivables_kpi.sql"); err != nil {
		return err
	}
	if _, err := tx.Exec("UPDATE users set first_name = $1, last_name = $2 where email = $3", "Admin", "Pulse", "admin@pulse.com"); err != nil {
		return err
	}
	return nil
}

func downFixOrderOfRanges(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
