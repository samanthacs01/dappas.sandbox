DROP FUNCTION IF EXISTS delete_insertion_order_by_order_number(p_order_no text);
CREATE OR REPLACE FUNCTION delete_insertion_order_by_order_number(p_order_no text)
  RETURNS boolean
  LANGUAGE plpgsql
  AS $function$
  DECLARE
     _f record;	
     _id integer;
  BEGIN
		_id := id from insertion_orders io where io.number = p_order_no limit 1;
		if _id is null then
		   return false;
		end if;
		-- Recalculate invoice relate with flights or remove if invoice has not more fligths
		FOR _f IN select distinct invoice_id from flights where insertion_order_id = _id AND invoice_id is not null
		LOOP
          RAISE NOTICE 'Processing invoice_id %', _f.invoice_id;
		  RAISE NOTICE 'Remove fligth from invoice_id %', _f.invoice_id;	
		  -- Remove flight 
          UPDATE flights f SET invoice_id = null WHERE f.insertion_order_id = _id AND f.invoice_id = _f.invoice_id;
          
		  RAISE NOTICE 'Delete all payments of invoice_id %', _f.invoice_id;	
		  -- remove all payment of invoice because it will be reset to pending_payment status
	      DELETE FROM invoice_payments WHERE invoice_id = _f.invoice_id;

		  -- if invoices does not have any other flight will be delete
		  IF NOT EXISTS (select 1 from flights f where f.invoice_id = _f.invoice_id) THEN
			DELETE FROM invoices i where i.id = _f.invoice_id; 
		  ELSE 	
			update invoices i set 
  				amount = f.total,
 		    	balance = f.total,
				status = 'pending_payment',
				change_by = 'manual'
			from (select sum(total_cost) as total from flights ff  WHERE ff.invoice_id = _f.invoice_id) f 
			where i.id = _f.invoice_id;
		  END IF;
		END LOOP;

		-- Recalculate bill relate with flights or remove if invoice has not more fligths
		FOR _f IN select distinct f.bill_id, f.production_id, b.due_date from flights f inner join bills b ON f.bill_id = b.id where insertion_order_id = _id
		LOOP
      RAISE NOTICE 'Processing bill_id %', _f.bill_id;
		  -- Remove flight 
          UPDATE flights f SET bill_id = null WHERE f.insertion_order_id = _id AND f.bill_id = _f.bill_id;
          
		  -- remove all payment of bills because it will be reset to pending_payment status
	      DELETE FROM bill_payments WHERE bill_id = _f.bill_id;

		  -- if bill does not have any other flight will be delete
		  IF NOT EXISTS (select 1 from flights f where f.bill_id = _f.bill_id) THEN
			DELETE FROM bills b where b.id = _f.bill_id; 
		  ELSE 
			 update bills b set 
				status = 'pending_payment'
			  where b.id = _f.bill_id;	

			if _f.due_date is not null then	
			  perform recalculate_with_expenses(_f.production_id, cast(extract(month from _f.due_date) as text), cast(extract(year from _f.due_date) as text), -1);
			end if;
		  END IF;
		END LOOP;
		
	    -- Clear flights data
	    DELETE FROM flight_dates WHERE flight_id in (select id from flights where insertion_order_id = _id);
	    DELETE FROM flights WHERE insertion_order_id = _id;

		-- Soft delete io drafs
		UPDATE io_drafts SET deleted_at = now() at time zone 'utc'::text WHERE id in (select io_draft_id from insertion_orders where id = _id);	
	
	    -- Delete insertion orders
	    DELETE FROM insertion_orders WHERE id = _id;

		return true;
	
	  EXCEPTION
	    WHEN OTHERS THEN
	      -- throw the err
	      RAISE NOTICE 'Error deleting insertion order: %', SQLERRM;
		  return false;	
  END;
  $function$