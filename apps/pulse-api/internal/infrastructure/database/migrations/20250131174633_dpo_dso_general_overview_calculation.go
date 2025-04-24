package migrations

import (
	"context"
	"database/sql"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upDpoDsoGeneralOverviewCalculation, downDpoDsoGeneralOverviewCalculation)
}

func upDpoDsoGeneralOverviewCalculation(ctx context.Context, tx *sql.Tx) error {
	if err := runStoreProcedureDdl(tx, "get_overview_general_dpo_details.sql"); err != nil {
		return err
	}
	if err := runStoreProcedureDdl(tx, "get_overview_general_dso_details.sql"); err != nil {
		return err
	}
	if err := runStoreProcedureDdl(tx, "get_payables_paid_uncollected_payment_productions.sql"); err != nil {
		return err
	}
	return nil
}

func downDpoDsoGeneralOverviewCalculation(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
