-- +goose Up
ALTER TABLE io_drafts DROP COLUMN IF EXISTS io_payer_name;
ALTER TABLE io_drafts DROP COLUMN IF EXISTS io_revenue;
ALTER TABLE io_drafts ADD COLUMN io_net_total_io_cost DECIMAL(10, 4);
ALTER TABLE io_drafts ADD COLUMN io_gross_total_io_cost DECIMAL(10, 4);
ALTER TABLE io_drafts ADD COLUMN io_total_io_impressions INT NOT NULL DEFAULT 0; 

ALTER TABLE io_draft_flights
ALTER COLUMN total_cost TYPE DECIMAL(10, 4);

ALTER TABLE io_draft_flights
ADD COLUMN cpm DECIMAL(10, 4);

ALTER TABLE io_draft_flights
RENAME COLUMN guaranteed_impressions TO impressions;

ALTER TABLE io_draft_flights
ADD COLUMN promo_code VARCHAR(50);

ALTER TABLE io_draft_flights
ADD COLUMN placement VARCHAR(50);

ALTER TABLE io_draft_flights
ADD COLUMN identifier VARCHAR(150) NOT NULL;

CREATE OR REPLACE VIEW view_io_draft_lists AS
	SELECT id, file_name, status FROM io_drafts WHERE deleted_at IS NULL;

-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
DROP VIEW IF EXISTS view_io_draft_lists;
ALTER TABLE io_draft_flights DROP COLUMN IF EXISTS identifier;
ALTER TABLE io_draft_flights DROP COLUMN IF EXISTS placement;
ALTER TABLE io_draft_flights DROP COLUMN IF EXISTS promo_code;
ALTER TABLE io_draft_flights DROP COLUMN IF EXISTS cpm;
ALTER TABLE io_draft_flights ALTER COLUMN total_cost TYPE DECIMAL(10, 2);
ALTER TABLE io_draft_flights RENAME COLUMN impressions TO guaranteed_impressions;
ALTER TABLE io_drafts DROP COLUMN IF EXISTS io_net_total_io_cost;
ALTER TABLE io_drafts DROP COLUMN IF EXISTS io_gross_total_io_cost;
ALTER TABLE io_drafts DROP COLUMN IF EXISTS io_total_io_impressions;
ALTER TABLE io_drafts ADD COLUMN io_revenue DECIMAL(10, 2);
ALTER TABLE io_drafts ADD COLUMN io_payer_name VARCHAR(255);
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
