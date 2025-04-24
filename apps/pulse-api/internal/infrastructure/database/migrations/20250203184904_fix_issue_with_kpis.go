package migrations

import (
	"context"
	"database/sql"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upFixIssueWithKpis, downFixIssueWithKpis)
}

func upFixIssueWithKpis(ctx context.Context, tx *sql.Tx) error {
	if err := runStoreProcedureDdl(tx, "get_overview_summary.sql"); err != nil {
		return err
	}
	if err := runStoreProcedureDdl(tx, "get_receivables_collect_rate_overall.sql"); err != nil {
		return err
	}
	if err := runStoreProcedureDdl(tx, "get_receivables_kpi.sql"); err != nil {
		return err
	}
	return nil
}

func downFixIssueWithKpis(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
