package migrations

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upFixIdentifierGeneratorPayersAndProductions, downFixIdentifierGeneratorPayersAndProductions)
}

func upFixIdentifierGeneratorPayersAndProductions(ctx context.Context, tx *sql.Tx) error {
	sql, err := readStoreProcedureSqlFile("payer_next_identifier.sql")
	if err != nil {
		fmt.Println("Error reading file: ", err)
		return err
	}
	_, err = tx.Exec(sql)
	if err != nil {
		fmt.Println("Error executing query: ", err)
		return err
	}
	sql, err = readStoreProcedureSqlFile("production_next_identifier.sql")
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

func downFixIdentifierGeneratorPayersAndProductions(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
