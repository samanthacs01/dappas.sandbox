-- +goose Up
    DROP VIEW IF EXISTS view_payers;
    CREATE OR REPLACE VIEW view_payers
                (id, entity_name, entity_address, contact_name, contact_email, contact_phone_number, identifier, search_field) AS
    SELECT id,
           entity_name,
           entity_address,
           contact_name,
           contact_email,
           contact_phone_number,
           identifier,
           entity_name || '&' || contact_name AS search_field
    FROM payers p
    WHERE deleted_at IS NULL;
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd
-- +goose Down
    DROP VIEW IF EXISTS view_payers;
    CREATE OR REPLACE VIEW view_payers
                (id, entity_name, entity_address, contact_name, contact_email, contact_phone_number, search_field) AS
    SELECT id,
           entity_name,
           entity_address,
           contact_name,
           contact_email,
           contact_phone_number,
           entity_name || '&' || contact_name AS search_field
    FROM payers p
    WHERE deleted_at IS NULL;
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
