-- +goose Up

ALTER TABLE insertion_orders
RENAME COLUMN revenue TO net_total_io_cost;

ALTER TABLE insertion_orders
ALTER COLUMN net_total_io_cost TYPE DECIMAL(10, 4);

ALTER TABLE insertion_orders
ADD COLUMN gross_total_io_cost DECIMAL(10, 4) NOT NULL DEFAULT 0;

ALTER TABLE insertion_orders
ADD COLUMN total_io_impressions INT NOT NULL DEFAULT 0;

ALTER TABLE insertion_orders
ALTER COLUMN payment_terms DROP NOT NULL;

ALTER TABLE flights
ADD COLUMN insertion_order_id INT REFERENCES insertion_orders(id);

ALTER TABLE flights
ALTER COLUMN total_cost TYPE DECIMAL(10, 4);

ALTER TABLE flights
ADD COLUMN cpm DECIMAL(10, 4);

ALTER TABLE flights
RENAME COLUMN guaranteed_impressions TO impressions;

ALTER TABLE flights
ADD COLUMN promo_code VARCHAR(50);

ALTER TABLE flights
ADD COLUMN placement VARCHAR(50);

ALTER TABLE flights
ADD COLUMN identifier VARCHAR(150) NOT NULL;

-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
ALTER TABLE flights
DROP COLUMN promo_code;

ALTER TABLE flights
RENAME COLUMN impressions TO guaranteed_impressions;

ALTER TABLE flights
DROP COLUMN cpm;

ALTER TABLE flights
ALTER COLUMN total_cost TYPE DECIMAL(10, 2);

ALTER TABLE flights
DROP COLUMN insertion_order_id;

ALTER TABLE flights
DROP COLUMN placement VARCHAR(50);

ALTER TABLE insertion_orders
ALTER COLUMN payment_terms SET NOT NULL;

ALTER TABLE insertion_orders
DROP COLUMN total_io_impressions;

ALTER TABLE insertion_orders
DROP COLUMN gross_total_io_cost;

ALTER TABLE insertion_orders
ALTER COLUMN net_total_io_cost TYPE DECIMAL(10, 2);

ALTER TABLE insertion_orders
RENAME COLUMN net_total_io_cost TO revenue;

-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
