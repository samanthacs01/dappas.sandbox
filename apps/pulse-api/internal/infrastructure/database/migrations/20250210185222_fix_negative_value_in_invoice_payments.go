package migrations

import (
	"context"
	"database/sql"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upFixNegativeValueInInvoicePayments, downFixNegativeValueInInvoicePayments)
}

func upFixNegativeValueInInvoicePayments(ctx context.Context, tx *sql.Tx) error {
	if err := runStoreProcedureDdl(tx, "payment_invoice.sql"); err != nil {
		return err
	}
	return nil
}

func downFixNegativeValueInInvoicePayments(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
