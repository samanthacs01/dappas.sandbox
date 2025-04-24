CREATE OR REPLACE FUNCTION payer_next_identifier()
 RETURNS text
 LANGUAGE plpgsql
AS $function$
		DECLARE
			next_identifier text;
		BEGIN
			RAISE NOTICE 'Starting';
			SELECT LPAD(COALESCE(cast(identifier as integer) + 1, 1)::TEXT, 3, '0') into next_identifier
			FROM payers p
			ORDER BY identifier DESC
			LIMIT 1;
			if next_identifier is null then
				next_identifier := '001';
	        end if;  
			return next_identifier;
			
		END;
		$function$
;