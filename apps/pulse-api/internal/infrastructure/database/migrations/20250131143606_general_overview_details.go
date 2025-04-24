package migrations

import (
	"context"
	"database/sql"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upGeneralOverviewDetails, downGeneralOverviewDetails)
}

func upGeneralOverviewDetails(ctx context.Context, tx *sql.Tx) error {
	if err := runStoreProcedureDdl(tx, "get_overview_summary.sql"); err != nil {
		return err
	}
	if err := runStoreProcedureDdl(tx, "get_collection_with_payment_terms.sql"); err != nil {
		return err
	}
	return nil
}

func downGeneralOverviewDetails(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
