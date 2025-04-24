CREATE OR REPLACE FUNCTION generate_invoice(
			p_flight_ids INTEGER[],
			p_user_id integer
		)
		RETURNS TABLE (
			invoice_id INTEGER,
			payer text,
			amount numeric(10,4),
			payment_terms int,
			due_date date
		) AS $$
			DECLARE
				inv_id INTEGER;
				existing_inv_id INTEGER;
				io RECORD;
				fg RECORD;
			BEGIN
				RAISE NOTICE 'Starting';

				FOR io IN 
					SELECT DISTINCT y.id, array_agg(f.id) over (partition by y.id) as flights, y.payment_terms, sum(f.total_cost) over(partition by y.id) as amount, y.id as payer_id
					FROM insertion_orders i 
					INNER JOIN flights f ON f.insertion_order_id = i.id
					INNER JOIN payers y ON i.payer_id = y.id
					WHERE f.id = ANY(p_flight_ids)

				LOOP 
					RAISE NOTICE 'Processing Insertion Order: %, Flights: %, Amount: %, Payment Terms: %', 
							io.id, io.flights, io.amount, io.payment_terms;             
					SELECT i.id INTO existing_inv_id 
					FROM invoices i
					WHERE i.payer_id = io.id
					AND i.id IN (
					    SELECT f.invoice_id 
					    FROM flights f 
					    WHERE f.id = ANY(io.flights)
					)
					AND i.status = 'draft' LIMIT 1;
					IF existing_inv_id IS NOT NULL THEN
						inv_id := existing_inv_id;
						RAISE NOTICE 'Using existing draft invoice id: %', inv_id;
						UPDATE invoices SET due_date = CURRENT_DATE + (io.payment_terms || ' day')::INTERVAL, invoiced_date = CURRENT_DATE, change_by = p_user_id::text
						WHERE id = inv_id;
					ELSE
						INSERT INTO invoices (identifier, due_date, invoiced_date, amount, balance, status, payer_id, change_by)
						VALUES ('DRAFT', CURRENT_DATE + (io.payment_terms || ' day')::INTERVAL, CURRENT_DATE, io.amount, io.amount, 'draft', io.payer_id, p_user_id::text)
						RETURNING id INTO inv_id;
						RAISE NOTICE 'Created new draft invoice id: %', inv_id;
					END IF;
					
					RAISE NOTICE 'CLEAR DATA of flight related to draft invoice % in %', inv_id, io.flights;
					UPDATE flights f SET invoice_id = null, change_by = p_user_id::text
					WHERE f.invoice_id = inv_id;

					RAISE NOTICE 'MARK Flights of draft invoice % in %', inv_id, io.flights;
					UPDATE flights SET invoice_id = inv_id, change_by = p_user_id::text
					WHERE id = ANY(io.flights);

					RAISE NOTICE 'CLEAR DATA does not % in %', inv_id, io.flights;
					
					DELETE FROM invoices i WHERE i.id NOT IN (SELECT f.invoice_id FROM flights f) AND i.payer_id = io.id;

				END LOOP;

				RAISE NOTICE 'Return DATA';

				RETURN QUERY 
				SELECT DISTINCT i.id as invoice_id, p.entity_name::text as payer, i.amount, p.payment_terms, i.due_date 
				FROM invoices i 
				INNER JOIN payers p ON i.payer_id = p.id
				INNER JOIn flights f ON i.id = f.invoice_id	
				WHERE f.id = ANY(p_flight_ids);
			END;
		$$ LANGUAGE plpgsql;