package migrations

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upAddDetilsOfPayablesKpi, downAddDetilsOfPayablesKpi)
}

func upAddDetilsOfPayablesKpi(ctx context.Context, tx *sql.Tx) error {
	sql, err := readStoreProcedureSqlFile("get_grouping_from_dates.sql")
	if err != nil {
		fmt.Println("Error reading file: ", err)
		return err
	}
	_, err = tx.Exec(sql)

	if err != nil {
		fmt.Println("Error reading file: ", err)
		return err
	}

	sql, err = readStoreProcedureSqlFile("get_payables_outstanding_dates.sql")
	if err != nil {
		fmt.Println("Error reading file: ", err)
		return err
	}
	_, err = tx.Exec(sql)
	if err != nil {
		fmt.Println("Error executing query: ", err)
		return err
	}
	sql, err = readStoreProcedureSqlFile("get_payables_outstanding_productions.sql")
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

func downAddDetilsOfPayablesKpi(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
