-- +goose Up
INSERT INTO insertion_orders(number, payer_id, net_total_io_cost, gross_total_io_cost, total_io_impressions, status)
SELECT 
  'IO-' || to_char(floor(random() * 900 + 10), 'FM0000') as io,
  p.id as payer_id,
  (random() * 70000 + 10000)::decimal(10,4) as net_cost,
  (random() * 90000 + 10000)::decimal(10,4) as gross_cost,
  floor(random() * 9000 + 1000) AS impressions,
  case when s.id % 2 = 0 then 'partial_invoiced' else 
  	case when s.id % 3 = 0 then 'invoiced' else 'pending' end end status
from payers p cross join  generate_series(1, 5) AS s(id)
order by p.id;

INSERT INTO flights(insertion_order_id, production_id, ads_type, placement, status, duration, total_cost, cpm, impressions, start_date, end_date, promo_code, identifier)
SELECT 
  io.id as insertion_order_id,
  (select id from productions p order by random() limit 1) as production_id,
  case when s.id %2 = 0 then 'Backed-In' else
  	case when s.id %3 = 0 then 'DAI' else 
  		case when s.id % 5 = 0 then 'Embedded' else 'Video' end end  end as ads_type,
  case when s.id %2 = 0 then 'mid-roll' else 
  	case when s.id % 3= 0 then 'post-roll' else 'pre-roll' end end as placement,
  case when s.id % 3 = 0 then 'invoiced' else 'pending' end status,
  floor(random() * 30 + 1) as duration,
  (random() * 7000 + 1000)::decimal(10,4) as total_cost,
  (random() * 100 + 10)::decimal(10,4) as cpm,
  floor(random() * 9000 + 1000) as impressions,
  now() - (random() * 30 + 1) * interval '1 day' as start_date,
  now() + (random() * 30 + 1) * interval '1 day' as end_date,
  case when io.id % 2 = 0 then 'PROMO-10' else 
  case when io.id % 3 = 0 then 'PROMO-20' else null end end promo_code,
  'F-' || to_char(floor(random() * 900 + 10), 'FM0000') as identifier
from insertion_orders io
cross join generate_series(1, floor(random() * 30 + 1)::integer) as s(id)
order by io.id;


-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- +goose Down
DELETE FROM flights;
DELETE FROM insertion_orders;
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
