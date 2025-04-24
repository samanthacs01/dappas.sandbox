package migrations

import (
	"context"
	"database/sql"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upAddYearIntervalOnOverview, downAddYearIntervalOnOverview)
}

func upAddYearIntervalOnOverview(ctx context.Context, tx *sql.Tx) error {
	if err := runStoreProcedureDdl(tx, "get_net_income_details.sql"); err != nil {
		return err
	}
	if err := runStoreProcedureDdl(tx, "get_overview_general_gross_margin_details.sql"); err != nil {
		return err
	}
	if err := runStoreProcedureDdl(tx, "get_overview_summary.sql"); err != nil {
		return err
	}
	return nil
}

func downAddYearIntervalOnOverview(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
