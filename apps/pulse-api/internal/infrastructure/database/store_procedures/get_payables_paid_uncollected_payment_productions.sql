DROP FUNCTION IF EXISTS get_payables_paid_uncollected_payment_productions(p_from date, p_to date);
CREATE OR REPLACE FUNCTION get_payables_paid_uncollected_payment_productions(p_from date, p_to date)
 RETURNS TABLE("grouping" text, grouping_details text, total numeric)
 LANGUAGE sql
AS $$
	 with payment_bills as (
		select distinct b.production_id, bp.id as payment_id, bp.amount
		from bills b 
		inner join bill_payments bp on b.id = bp.bill_id 
		inner join flights f on b.id = f.bill_id
		inner join invoices i on f.invoice_id = i.id 
		where i.status <> 'paid' and b.deleted_at is null and f.deleted_at is null and bp.payment_at::date between p_from AND p_to
	 ),
	 payment_bills_sum as (
		select production_id, sum(amount) as total
		from payment_bills
    	GROUP by production_id
	 ),
	 calculate_outstanding as ( 
		select p.entity_name::text as "grouping", p.entity_name::text as "grouping_details", coalesce(bp.total, 0) as "total"
         from payment_bills_sum bp
		 inner join productions p on bp.production_id = p.id
      ) select distinct c."grouping", c."grouping_details", c."total" from  calculate_outstanding c
          WHERE c.total > 0;	 
$$;
