package migrations

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upFixIdentifierForFlights, downFixIdentifierForFlights)
}

// Fix the identifier for flights
// This migration is to fix the identifier for flights
func upFixIdentifierForFlights(ctx context.Context, tx *sql.Tx) error {
	sql, err := readStoreProcedureSqlFile("fn_create_flights.sql")
	if err != nil {
		fmt.Println("Error reading file: ", err)
		return err
	}
	_, err = tx.Exec(sql)
	if err != nil {
		fmt.Println("Error executing query: ", err)
		return err
	}
	return nil
}

func downFixIdentifierForFlights(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
