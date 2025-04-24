-- +goose Up
INSERT INTO io_drafts (file_name, file_path, status) 
VALUES ('AFK_NordVPN_UNEX OPP NC HvW JE_Q3 2022 IO', 'orders/AFK_NordVPN_UNEX OPP NC HvW JE_Q3 2022 IO.pdf', 'uploaded'),
 ('AFK_NordVPN_UNEX OPP NC HvW JE_Q4 2022 IO', 'orders/AFK_NordVPN_UNEX OPP NC HvW JE_Q4 2022 IO.pdf','uploaded');

-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
DELETE FROM io_drafts;
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
