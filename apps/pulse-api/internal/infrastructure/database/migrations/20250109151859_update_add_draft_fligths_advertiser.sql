-- +goose Up
ALTER TABLE io_draft_flights ADD COLUMN IF NOT EXISTS advertiser VARCHAR(255);
ALTER TABLE flights ADD COLUMN IF NOT EXISTS advertiser VARCHAR(255);
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
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
