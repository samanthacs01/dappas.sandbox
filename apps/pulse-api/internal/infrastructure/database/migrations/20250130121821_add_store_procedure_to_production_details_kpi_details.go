package migrations

import (
	"context"
	"database/sql"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upAddStoreProcedureToProductionDetailsKpiDetails, downAddStoreProcedureToProductionDetailsKpiDetails)
}

func upAddStoreProcedureToProductionDetailsKpiDetails(ctx context.Context, tx *sql.Tx) error {
	if err := runStoreProcedureDdl(tx, "get_production_details_kpi.sql"); err != nil {
		return err
	}
	if err := runStoreProcedureDdl(tx, "get_production_details_booking_dates.sql"); err != nil {
		return err
	}
	if err := runStoreProcedureDdl(tx, "get_production_details_revenues_dates.sql"); err != nil {
		return err
	}
	if err := runStoreProcedureDdl(tx, "get_booking_fulfillment_rate.sql"); err != nil {
		return err
	}
	return nil
}

func downAddStoreProcedureToProductionDetailsKpiDetails(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
