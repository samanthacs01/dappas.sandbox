package migrations

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upUpdateKpiFunctions2, downUpdateKpiFunctions2)
}

func upUpdateKpiFunctions2(ctx context.Context, tx *sql.Tx) error {
	funCalculateReceivableKpi := `
		CREATE OR REPLACE FUNCTION public.get_receivables_kpi(p_start_date date, p_end_date date)
			RETURNS table (
				total_outstanding numeric,
				total_overdue numeric,
				collection_rate numeric,
				collection_with_payment_terms numeric,
				customer_concentration numeric
			)
			LANGUAGE plpgsql
			AS $function$
			DECLARE
				total_outstanding numeric;
				total_overdue numeric;
				customer_concentration numeric;
				collection_rate numeric;
				collection_with_payment_terms numeric;	
				top5_payers_rate numeric;
				_total_paid_amount numeric;
				_total_amount numeric;	
				_total_unpaid_amount numeric;
				_total_due_amount numeric;
				_total_top5_payers numeric;
				
			BEGIN
				total_outstanding := SUM(balance)
					FROM invoices
					WHERE invoiced_date BETWEEN p_start_date AND p_end_date AND status <> 'paid' AND status <> 'draft';
				if total_outstanding is null then 
				   total_outstanding := 0;
				end if;

				total_overdue := SUM(balance)
				     FROM invoices
				     WHERE due_date BETWEEN p_start_date AND p_end_date
				     AND status <> 'paid' AND status <> 'draft';

				if total_overdue is null then 
				   total_overdue := 0;
				end if;

				_total_paid_amount := SUM(i.amount) FROM invoices i
					INNER JOIN (
					    SELECT 
					        invoice_id,
					        MAX(paid_at) AS last_payment_date
					    FROM 
					        invoice_payments
					    GROUP BY 
					        invoice_id
					) ip ON i.id = ip.invoice_id
					where ip.last_payment_date BETWEEN p_start_date AND p_end_date and i.status = 'paid';

				if _total_paid_amount is null then 
					_total_paid_amount := 0;
				end if;

				_total_amount :=  sum(amount) from invoices where invoiced_date BETWEEN p_start_date AND p_end_date;
				
				if _total_amount is null then 
					_total_amount := 0;
				end if;

				_total_unpaid_amount :=  sum(amount) from invoices where invoiced_date <= p_end_date AND status <> 'paid' AND status <> 'draft'; 
				
				if _total_unpaid_amount is null then 
					_total_unpaid_amount := 0;
				end if;

				_total_due_amount :=  sum(amount) from invoices where invoiced_date <= p_end_date AND due_date BETWEEN p_start_date AND p_end_date AND status <> 'paid' AND status <> 'draft';
				
				if _total_due_amount is null then 
					_total_due_amount := 0;
				end if;

				collection_rate := case when _total_unpaid_amount = 0 then 0 else _total_paid_amount / _total_unpaid_amount * 100 end;
				if collection_rate is null then 
				   collection_rate := 0;
				end if;
				
				collection_with_payment_terms := case when _total_due_amount = 0 then 0 else _total_paid_amount / _total_due_amount * 100 end;
				
				if collection_with_payment_terms is null then 
				   collection_with_payment_terms := 0;
				end if;

				_total_top5_payers := (with top5_payers as (
						select i.payer_id, sum(i.amount) as total_amount
						from invoices i where i.invoiced_date BETWEEN p_start_date AND p_end_date and i.status <> 'draft'
						group by i.payer_id
						order by total_amount desc 
						limit 5
					)
					select sum(total_amount) from top5_payers);
                
				customer_concentration:= case when _total_amount = 0 then 0 else _total_top5_payers / _total_amount * 100 end;
				if customer_concentration is null then 
				   customer_concentration := 0;
				end if;
				
					
				RETURN query select total_outstanding,
				total_overdue,
				collection_rate::numeric(10,2),
				collection_with_payment_terms::numeric(10,2),
				customer_concentration::numeric(10,2);
			END;
			$function$;	
	`
	_, err := tx.Exec(funCalculateReceivableKpi)
	if err != nil {
		fmt.Println("FAIL migrating upCalculateKpiOfReceivables", err)
		return err
	}
	_, err = tx.Exec("DROP FUNCTION public.get_payables_kpi(p_start_date date, p_end_date date)")
	if err != nil {
		fmt.Println("FAIL migrating dropping function", err)
		return err
	}
	// This code is executed when the migration is applied.
	funKPIPayables := `CREATE OR REPLACE FUNCTION public.get_payables_kpi(p_start_date date, p_end_date date)
			RETURNS table (
				total_outstanding numeric,
				total_overdue numeric,
				on_time_payment_rate numeric,
				production_payment_on_uncollected_invoices numeric
			)
			LANGUAGE plpgsql
			AS $function$
			DECLARE
				total_outstanding numeric;
				total_overdue numeric;
				on_time_payment_rate numeric;
				production_payment_on_uncollected_invoices numeric;
				_total_paid_amount numeric;
				_total_amount numeric;	
				_total_due_amount numeric;
				
			BEGIN
				total_outstanding := SUM(balance)
					FROM bills
					WHERE created_at BETWEEN p_start_date AND p_end_date AND status <> 'paid';
				if total_outstanding is null then 
				   total_outstanding := 0;
				end if;

				total_overdue := SUM(balance)
				     FROM bills
				     WHERE due_date BETWEEN p_start_date AND p_end_date
				     AND status <> 'paid';

				if total_overdue is null then 
				   total_overdue := 0;
				end if;

				_total_paid_amount := SUM(b.amount) FROM bills b
					INNER JOIN (
					    SELECT 
					        bill_id,
					        MAX(payment_at) AS last_payment_date
					    FROM 
					        bill_payments
					    GROUP BY 
					        bill_id
					) ip ON b.id = ip.bill_id
					where ip.last_payment_date::date BETWEEN p_start_date AND p_end_date and b.status = 'paid' and ip.last_payment_date::date <= b.due_date;

				if _total_paid_amount is null then 
					_total_paid_amount := 0;
				end if;

				_total_amount :=  sum(amount) from bills where created_at::date BETWEEN p_start_date AND p_end_date;
				
				if _total_amount is null then 
					_total_amount := 0;
				end if;

				_total_due_amount :=  sum(amount) from bills where due_date BETWEEN p_start_date AND p_end_date AND status <> 'paid';
				
				if _total_due_amount is null then 
					_total_due_amount := 0;
				end if;

				
				on_time_payment_rate := case when _total_due_amount = 0 then 0 else _total_paid_amount / _total_due_amount * 100 end;
				
				if on_time_payment_rate is null then 
				   on_time_payment_rate := 0;
				end if;


				production_payment_on_uncollected_invoices := (with payment_bills as (
						select distinct b.id, bp.id as payment_id, bp.amount
						from bills b 
						inner join bill_payments bp on b.id = bp.bill_id 
						inner join invoice_items ii on b.id = ii.bill_id
						inner join invoices i on ii.invoice_id = i.id 
						where i.status <> 'paid' and bp.payment_at::date between p_start_date AND p_end_date
					)
					select sum(amount) from payment_bills);

				if production_payment_on_uncollected_invoices is null then 
				   production_payment_on_uncollected_invoices := 0;
				end if;
				
					
				RETURN query select total_outstanding,
				total_overdue,
				on_time_payment_rate::numeric(10,2),
				production_payment_on_uncollected_invoices::numeric(10,2);
			END;
			$function$`
	_, err = tx.Exec(funKPIPayables)
	return err
}

func downUpdateKpiFunctions2(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
