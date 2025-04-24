-- +goose Up
CREATE OR REPLACE VIEW public.view_insertion_orders
AS WITH cte_flights AS (
  SELECT 
    f.insertion_order_id,
    array_agg(DISTINCT f.advertiser) as advertisers,
    array_agg(DISTINCT f.media) as medias
  FROM flights f
  WHERE f.deleted_at is NULL
  GROUP BY f.insertion_order_id
)
SELECT DISTINCT io.id,
    io.number,
    p.entity_name AS payer,
    io.net_total_io_cost,
    io.gross_total_io_cost,
    io.total_io_impressions,
    io.status,
    io.payer_id,
    io.created_at,
    (((((((io.number::text || ';'::text) || p.entity_name::text) || ';'::text) || p.contact_name::text) || ';'::text) || p.contact_email::text) || ';'::text) || p.contact_phone_number::text AS search,
    io.signed_at AS signed_date,
    f.advertisers,
    f.medias
FROM insertion_orders io
JOIN payers p ON io.payer_id = p.id
LEFT JOIN cte_flights f ON f.insertion_order_id = io.id
WHERE p.deleted_at IS NULL AND io.deleted_at IS NULL;
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
