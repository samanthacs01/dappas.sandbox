DROP FUNCTION IF EXISTS fn_create_flights(integer, integer, integer, varchar(100), varchar(50), numeric, integer, numeric, varchar(50), varchar(50), varchar(255), varchar(100), varchar(255), text[]);
CREATE OR REPLACE FUNCTION fn_create_flights(
			p_io_flight_draft_id integer,
			p_io_id integer,
			p_production_id integer,
			p_change_by varchar(100),
			p_ads_type varchar(50),
			p_total_cost numeric,
			p_impressions integer,
			p_cpm numeric,
			p_promo_code varchar(50),
			p_placement varchar(50),
			p_advertiser varchar(255),
			p_length varchar(100),
			p_media varchar(255),
            p_drop_dates text[]
		)  
		RETURNS integer AS $$
		DECLARE
			_id INTEGER;
			_dd text;	
			_next_identifier text;
			_io_identifier text;
			_previous_identifier text;
			_plus_position INTEGER;
			dates text[];
    		start_date date;
    		end_date date;
		BEGIN
			RAISE NOTICE 'Starting';
		_io_identifier := "number" from insertion_orders where id = p_io_id;
		RAISE NOTICE 'IO Number, %', _io_identifier;
		_previous_identifier := max(identifier) as previous from flights where insertion_order_id = p_io_id;
		RAISE NOTICE 'Flight Previous Identifier, %', _previous_identifier;
		if _previous_identifier is null then
			_previous_identifier := _io_identifier || '-00';
		end if;
        with max_identifier_part as (
			select substring(_previous_identifier from 12) as previous
		)
 		select _io_identifier || '-' || LPAD(COALESCE(CAST(m.previous as integer) + 1, 1)::text, 2, '0') into _next_identifier
		from max_identifier_part m;
		RAISE NOTICE 'Flight NEXT Identifier, %', _next_identifier;
			INSERT INTO public.flights(
                 production_id, 
                 ads_type, 
                 total_cost, 
                 impressions, 
                 status, 
                 insertion_order_id, 
                 cpm, 
                 promo_code, 
                 placement,  
                 identifier, 
                 advertiser, 
                 io_flight_draft_id, 
                 length, 
                 media, 
                 change_by)
             VALUES(
				p_production_id, 
				p_ads_type, 
				p_total_cost, 
				p_impressions, 
				'pending', 
				p_io_id, 
				p_cpm,
				p_promo_code, 
				p_placement, 
				_next_identifier, 
				p_advertiser, 
				p_io_flight_draft_id, 
				p_length, 
				p_media, 
				p_change_by
            ) returning id into _id;

			foreach _dd in array p_drop_dates 
			LOOP
				_plus_position := position('+' in _dd);
			    IF _plus_position > 0 THEN
					--raise notice '% to %',substring(_dd for 10), substring(_dd from '(\+(\d{4}-\d{2}-\d{2})' for 10);
			        start_date := TO_DATE(substring(_dd for 10), 'YYYY-MM-DD');
    				end_date := TO_DATE(substring(_dd from _plus_position + 1 for 10), 'YYYY-MM-DD');
 					INSERT INTO public.flight_dates
						(flight_id, init_date, end_date, value_type)
						VALUES( _id, start_date, end_date, 'range');
			    ELSE
			       INSERT INTO public.flight_dates
						(flight_id, init_date, end_date, value_type)
						VALUES( _id, _dd::date, _dd::date, 'specific');
			    END IF;
			END LOOP;
			return _id;	 
		END;
		$$ LANGUAGE plpgsql;
