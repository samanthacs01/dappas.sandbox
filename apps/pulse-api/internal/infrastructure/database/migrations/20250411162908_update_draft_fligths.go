package migrations

import (
	"context"
	"database/sql"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upUpdateDraftFligths, downUpdateDraftFligths)
}

func upUpdateDraftFligths(ctx context.Context, tx *sql.Tx) error {
	if _, err := tx.Exec(`
		DROP VIEW IF EXISTS view_io_flight_lists;
	`); err != nil {
		return err
	}
	if _, err := tx.Exec(`
		DO $$
			DECLARE
				col_name TEXT;
			BEGIN
				FOR col_name IN
					SELECT column_name
					FROM information_schema.columns
					WHERE table_name = 'io_draft_flights' AND data_type = 'character varying' AND character_maximum_length = 50
				LOOP
					EXECUTE format('ALTER TABLE io_draft_flights ALTER COLUMN %I TYPE varchar;', col_name);
				END LOOP;
		END $$;
	`); err != nil {
		return err
	}
	if _, err := tx.Exec(`
		CREATE OR REPLACE VIEW view_io_flight_lists
		AS SELECT iof.id,
			iof.io_draft_id,
			iof.identifier,
			p.id AS production_id,
			p.entity_name AS production_name,
			iof.ads_type,
			iof.placement,
			iof.length AS duration,
			iof.cpm,
			iof.total_cost,
			iof.flight_dates AS drop_dates,
			iof.media,
			iof.production AS production_suggested,
			iof.host,
			iof.spots,
			iof.live_prerecorded,
			iof.promo_code,
			iof.impressions,
			iof.advertiser
		FROM io_draft_flights iof
			LEFT JOIN productions p ON iof.production_id = p.id AND p.deleted_at IS NULL
		WHERE iof.deleted_at IS NULL;
	`); err != nil {
		return err
	}
	return nil
}

func downUpdateDraftFligths(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
