package migrations

import (
	"context"
	"database/sql"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upFixKpiInternalServerError, downFixKpiInternalServerError)
}

func upFixKpiInternalServerError(ctx context.Context, tx *sql.Tx) error {
	if err := runStoreProcedureDdl(tx, "get_production_details_kpi.sql"); err != nil {
		return err
	}
	return nil
}

func downFixKpiInternalServerError(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
