-- +goose Up
drop VIEW public.view_booking_kpi;

CREATE OR REPLACE VIEW public.view_booking_kpi
AS SELECT 
    created_at::date AS booked_date,
    sum(net_total_io_cost) AS total_orders,
    sum(
        CASE
            WHEN status = 'invoiced' THEN net_total_io_cost
            ELSE 0
        END) AS total_executed_orders,
     to_char(date_trunc('month', created_at::date), 'Mon, YYYY') as booked_month,
     to_char(date_trunc('week', created_at::date), 'MM/DD') || ' - ' || to_char(date_trunc('week', created_at::date) + '6 day'::interval, 'MM/DD') as booked_week
   FROM insertion_orders
  GROUP BY (created_at::date);
  
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
