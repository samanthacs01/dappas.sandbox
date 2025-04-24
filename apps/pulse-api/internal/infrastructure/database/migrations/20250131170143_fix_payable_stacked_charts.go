package migrations

import (
	"context"
	"database/sql"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upFixPayableStackedCharts, downFixPayableStackedCharts)
}

func upFixPayableStackedCharts(ctx context.Context, tx *sql.Tx) error {
	if err := runStoreProcedureDdl(tx, "get_payables_on_time_payment_rate_dates.sql"); err != nil {
		return err
	}
	if err := runStoreProcedureDdl(tx, "get_payables_overdue_bills.sql"); err != nil {
		return err
	}
	return nil
}

func downFixPayableStackedCharts(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
