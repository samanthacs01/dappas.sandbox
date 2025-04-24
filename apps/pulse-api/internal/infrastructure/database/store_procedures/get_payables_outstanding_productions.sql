DROP FUNCTION IF EXISTS get_payables_outstanding_productions(p_from date, p_to date);
CREATE OR REPLACE FUNCTION get_payables_outstanding_productions(p_from date, p_to date)
 RETURNS TABLE("grouping" text, grouping_details text, total numeric)
 LANGUAGE sql
AS $$
	 with calculate_outstanding as ( select p.entity_name::text as "grouping", p.entity_name::text as "grouping_details", sum(b.balance) over(partition by p.id) as "total"
                  from bills b inner join productions p on b.production_id = p.id
				  where b.deleted_at is null and p.deleted_at is null and b.created_at::date between p_from and p_to and b.status <> 'paid'
      ) select c."grouping", c."grouping_details", c."total" from  calculate_outstanding c
          WHERE c.total > 0;	 
		$$
;
