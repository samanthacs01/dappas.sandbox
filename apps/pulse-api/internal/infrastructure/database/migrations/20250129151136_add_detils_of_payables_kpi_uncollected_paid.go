package migrations

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upAddDetilsOfPayablesKpiUncollectedPaid, downAddDetilsOfPayablesKpiUncollectedPaid)
}

func upAddDetilsOfPayablesKpiUncollectedPaid(ctx context.Context, tx *sql.Tx) error {
	sql, err := readStoreProcedureSqlFile("get_payables_paid_uncollected_payment_dates.sql")
	if err != nil {
		fmt.Println("Error reading file: ", err)
		return err
	}
	_, err = tx.Exec(sql)
	if err != nil {
		fmt.Println("Error executing query: ", err)
		return err
	}
	sql, err = readStoreProcedureSqlFile("get_payables_paid_uncollected_payment_productions.sql")
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

func downAddDetilsOfPayablesKpiUncollectedPaid(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
