-- +goose Up
ALTER TABLE users
ADD COLUMN first_name VARCHAR(255) DEFAULT '' NOT NULL,
ADD COLUMN last_name VARCHAR(255) DEFAULT '' NOT NULL;

DROP VIEW IF EXISTS view_users;
CREATE OR REPLACE VIEW view_users
                (id, first_name, last_name, email, role, active, search) AS
SELECT id,
       first_name,
       last_name,
       email,
       role,
       active,
       first_name || '&' || email AS search
FROM users u
WHERE deleted_at IS NULL;
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
