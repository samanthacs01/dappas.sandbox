package migrations

import (
	"context"
	"database/sql"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upFixPayablesReceivablesOverdue, downFixPayablesReceivablesOverdue)
}

func upFixPayablesReceivablesOverdue(ctx context.Context, tx *sql.Tx) error {
	if err := runStoreProcedureDdl(tx, "get_receivables_overdue.sql"); err != nil {
		return err
	}
	if err := runStoreProcedureDdl(tx, "get_payables_overdue_bills.sql"); err != nil {
		return err
	}
	return nil
}

func downFixPayablesReceivablesOverdue(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
