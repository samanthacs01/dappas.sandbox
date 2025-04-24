package migrations

import (
	"context"
	"database/sql"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upFixPayablesKpiCalculation, downFixPayablesKpiCalculation)
}

func upFixPayablesKpiCalculation(ctx context.Context, tx *sql.Tx) error {
	if err := runStoreProcedureDdl(tx, "get_payables_kpi.sql"); err != nil {
		return err
	}
	if err := runStoreProcedureDdl(tx, "get_payables_on_time_payment_rate_dates.sql"); err != nil {
		return err
	}
	return nil
}

func downFixPayablesKpiCalculation(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
