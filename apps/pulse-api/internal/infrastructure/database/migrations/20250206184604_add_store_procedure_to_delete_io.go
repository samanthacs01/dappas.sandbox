package migrations

import (
	"context"
	"database/sql"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upAddStoreProcedureToDeleteIo, downAddStoreProcedureToDeleteIo)
}

func upAddStoreProcedureToDeleteIo(ctx context.Context, tx *sql.Tx) error {
	if err := runStoreProcedureDdl(tx, "delete_insertion_order_by_id.sql"); err != nil {
		return err
	}
	return nil
}

func downAddStoreProcedureToDeleteIo(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
