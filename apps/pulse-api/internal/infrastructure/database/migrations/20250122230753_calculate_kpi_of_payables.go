package migrations

import (
	"context"
	"database/sql"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upCalculateKpiOfPayables, downCalculateKpiOfPayables)
}

func upCalculateKpiOfPayables(ctx context.Context, tx *sql.Tx) error {
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
	_, err := tx.Exec(funKPIPayables)
	return err
}

func downCalculateKpiOfPayables(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
