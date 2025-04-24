-- +goose Up
ALTER TABLE payers ADD COLUMN IF NOT EXISTS payment_terms INT;

UPDATE payers
SET payment_terms = FLOOR(RANDOM() * (90 - 10 + 1) + 10)::INT
WHERE payment_terms IS NULL;

DROP VIEW IF EXISTS view_payers;
CREATE OR REPLACE VIEW view_payers
                (id, entity_name, entity_address, contact_name, contact_email, contact_phone_number, identifier, payment_terms, search_field) AS
SELECT id,
       entity_name,
       entity_address,
       contact_name,
       contact_email,
       contact_phone_number,
       identifier,
       payment_terms,
       entity_name || '&' || contact_name AS search_field
FROM payers p
WHERE deleted_at IS NULL;
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
