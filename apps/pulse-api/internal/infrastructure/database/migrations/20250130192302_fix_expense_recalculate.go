package migrations

import (
	"context"
	"database/sql"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upFixExpenseRecalculate, downFixExpenseRecalculate)
}

func upFixExpenseRecalculate(ctx context.Context, tx *sql.Tx) error {
	if err := runStoreProcedureDdl(tx, "recalculate_with_expenses.sql"); err != nil {
		return err
	}
	return nil
}

func downFixExpenseRecalculate(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
