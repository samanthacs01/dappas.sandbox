package migrations

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upFixIssueWithPaymentInvoice, downFixIssueWithPaymentInvoice)
}

func upFixIssueWithPaymentInvoice(ctx context.Context, tx *sql.Tx) error {
	sql, err := readStoreProcedureSqlFile("fn_create_flights.sql")
	if err != nil {
		fmt.Println("Error reading file: ", err)
		return err
	}
	_, err = tx.Exec(sql)

	if err != nil {
		fmt.Println("Error reading file: ", err)
		return err
	}

	sql, err = readStoreProcedureSqlFile("payment_invoice.sql")
	if err != nil {
		fmt.Println("Error reading file: ", err)
		return err
	}
	_, err = tx.Exec(sql)
	if err != nil {
		fmt.Println("Error executing query: ", err)
	}
	return err
}

func downFixIssueWithPaymentInvoice(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
