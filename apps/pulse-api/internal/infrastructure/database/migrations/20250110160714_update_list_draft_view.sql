-- +goose Up
DROP VIEW IF EXISTS view_io_draft_lists;
CREATE OR REPLACE VIEW view_io_draft_lists AS
	SELECT id, file_name, file_path, status FROM io_drafts WHERE deleted_at IS NULL AND status <> 'reviewed';
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
