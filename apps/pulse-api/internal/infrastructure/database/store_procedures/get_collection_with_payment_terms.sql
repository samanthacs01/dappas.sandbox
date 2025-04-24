DROP FUNCTION IF EXISTS get_collection_with_payment_terms(p_from date, p_to date);
CREATE OR REPLACE FUNCTION get_collection_with_payment_terms(p_from date, p_to date)
 RETURNS TABLE("grouping" text, grouping_details text, total numeric(10,2))
 LANGUAGE sql
AS $$
    with collection_with_payment_terms as (
		select SUM(i.amount) as total FROM invoices i
		LEFT JOIN (
			SELECT invoice_id, MAX(paid_at) AS last_payment_date
			FROM invoice_payments
			GROUP BY invoice_id
		) ip ON i.id = ip.invoice_id
		WHERE (i.due_date >= ip.last_payment_date AND ip.last_payment_date BETWEEN p_from AND p_to AND status='paid')
			OR (i.invoiced_date <= p_to AND i.due_date BETWEEN p_from AND p_to AND status=any(array['pending_payment', 'partial_paid']))
	),
    paid_with_payment_terms as (
        select SUM(i.amount) as amount FROM invoices i
			INNER JOIN (
			    SELECT invoice_id, MAX(paid_at) AS last_payment_date
				FROM invoice_payments
				GROUP BY invoice_id
			) ip ON i.id = ip.invoice_id
		where i.due_date >= ip.last_payment_date and ip.last_payment_date BETWEEN p_from AND p_to and i.status = 'paid'
    ),
    unpaid_with_payment_terms as (
        select cpt.total - pt.amount as amount FROM collection_with_payment_terms cpt, paid_with_payment_terms pt
    ),
	items as (
		select 'Paid Within Terms' as grouping,'Paid Within Terms' as grouping_details, case when i.amount is null THEN 0 Else i.amount end as it_total FROM paid_with_payment_terms i
		union all 
		select 'Due Within Terms Unpaid' as grouping,'Due Within Terms Unpaid' as grouping_details, case when i.amount is null then 0 else i.amount end as it_total FROM unpaid_with_payment_terms i
	)
	select distinct it.grouping, it.grouping_details, case when t.total is null or t.total = 0 then 0 else (it.it_total/t.total *100)::numeric(10,2) end as total from items it, collection_with_payment_terms t
$$;