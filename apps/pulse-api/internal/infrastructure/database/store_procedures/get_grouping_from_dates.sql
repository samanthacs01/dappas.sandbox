DROP FUNCTION IF EXISTS get_grouping_from_dates(p_from date, p_to date);
CREATE OR REPLACE FUNCTION get_grouping_from_dates(p_from date, p_to date)
RETURNS TABLE ("grouping" text,day date)
LANGUAGE sql
AS $$
WITH calculate_interval AS (
    select age(p_to, p_from) as a
),
interval_start AS (
    SELECT 
        case 
            WHEN a > interval '1 year' then interval '1 year' 
            WHEN a > interval '1 month' then interval '1 month'
            WHEN a > interval '1 week' then interval '1 week'
            ELSE interval '1 day'
        END AS interval,
        case 
            WHEN a > interval '1 year' then date_trunc('year', p_from) 
            WHEN a > interval '1 month' then date_trunc('month', p_from)
            WHEN a > interval '1 week' then date_trunc('week', p_from)
            ELSE p_from
        END AS start_date
    FROM calculate_interval
),
date_range AS (
    SELECT generate_series(
        i.start_date,
        p_to,
        i.interval
    ) AS day from interval_start i
),
date_range_ordered AS (
    SELECT day, 
    EXTRACT(year from day) as order1, 
    EXTRACT(DOY FROM day) as order2,
    CASE 
      WHEN ci.a > interval '1 year' THEN  day + INTERVAL '1 year' - INTERVAL '1 day'
      WHEN ci.a > interval '1 month' THEN day + INTERVAL '1 month' - INTERVAL '1 day'
      WHEN ci.a > interval '1 week' THEN day + INTERVAL '6 day'
      ELSE day 
    END as last_day 
    from date_range CROSS JOIn calculate_interval ci order by day
)
SELECT DISTINCT 
    CASE 
        WHEN ci.a > interval '1 year' THEN to_char(dr.day, 'YYYY')
        WHEN ci.a > interval '1 month' THEN to_char(dr.day, 'Mon, YYYY')
        WHEN ci.a > interval '1 week' THEN to_char(dr.day, 'MM/DD') || ' - ' || to_char(dr.last_day, 'MM/DD')
        ELSE to_char(dr.day, 'MM/DD/YY')
    END AS grouping,
    dr.day::date as day
FROM date_range_ordered dr 
cross join calculate_interval ci;
$$;