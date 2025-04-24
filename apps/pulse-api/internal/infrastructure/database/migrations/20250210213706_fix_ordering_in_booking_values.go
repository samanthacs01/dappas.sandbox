package migrations

import (
	"context"
	"database/sql"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upFixOrderingInBookingValues, downFixOrderingInBookingValues)
}

func upFixOrderingInBookingValues(ctx context.Context, tx *sql.Tx) error {
	if err := runStoreProcedureDdl(tx, "get_booking_values.sql"); err != nil {
		return err
	}
	if err := runStoreProcedureDdl(tx, "get_receivables_kpi.sql"); err != nil {
		return err
	}
	return nil
}

func downFixOrderingInBookingValues(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
