-- +goose Up
ALTER TABLE io_drafts DROP COLUMN IF EXISTS signed_at;
ALTER TABLE io_drafts ADD COLUMN IF NOT EXISTS signed_at VARCHAR(255);
ALTER TABLE io_drafts ADD COLUMN IF NOT EXISTS payer VARCHAR(255);
ALTER TABLE io_drafts ADD COLUMN IF NOT EXISTS creator VARCHAR(255);
ALTER TABLE io_drafts ADD COLUMN IF NOT EXISTS payer_id INT REFERENCES payers(id);
ALTER TABLE io_drafts ADD COLUMN IF NOT EXISTS io_gross_total_io_cost_currency VARCHAR(255);
ALTER TABLE io_drafts ADD COLUMN IF NOT EXISTS io_net_total_io_cost_currency VARCHAR(255);


ALTER TABLE insertion_orders ADD COLUMN IF NOT EXISTS advertiser VARCHAR(255);
ALTER TABLE insertion_orders ADD COLUMN IF NOT EXISTS signed_at VARCHAR(255);
ALTER TABLE insertion_orders ADD COLUMN IF NOT EXISTS media VARCHAR(255);

ALTER TABLE flights ADD COLUMN IF NOT EXISTS advertiser VARCHAR(255);

ALTER TABLE io_draft_flights ADD COLUMN IF NOT EXISTS production VARCHAR(255);
ALTER TABLE io_draft_flights ADD COLUMN IF NOT EXISTS flight_dates VARCHAR(255);
ALTER TABLE io_draft_flights ADD COLUMN IF NOT EXISTS media VARCHAR(255);
ALTER TABLE io_draft_flights ADD COLUMN IF NOT EXISTS host VARCHAR(255);
ALTER TABLE io_draft_flights ADD COLUMN IF NOT EXISTS spots int;
ALTER TABLE io_draft_flights RENAME COLUMN duration TO length;
ALTER TABLE io_draft_flights ADD COLUMN IF NOT EXISTS live_prerecorded VARCHAR(255);
ALTER TABLE io_draft_flights ADD COLUMN IF NOT EXISTS total_cost_currency VARCHAR(15);
ALTER TABLE io_draft_flights ADD COLUMN IF NOT EXISTS cpm_currency VARCHAR(15);

drop view public.view_io_flight_lists;

CREATE OR REPLACE VIEW public.view_io_flight_lists
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
    iof.production as production_suggested,
    iof.host, 
    iof.spots,
    iof.live_prerecorded,
    iof.promo_code,
    iof.impressions
   FROM io_draft_flights iof
     LEFT JOIN productions p ON iof.production_id = p.id AND p.deleted_at IS NULL
  WHERE iof.deleted_at IS NULL;


-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
