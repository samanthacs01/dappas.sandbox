package migrations

import (
	"context"
	"database/sql"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upAddPaymentRegister, downAddPaymentRegister)
}

func upAddPaymentRegister(ctx context.Context, tx *sql.Tx) error {
	invoicePaymentsTable := `
		create table if not exists invoice_payments (
			id serial primary key,
			invoice_id integer references invoices(id),
			amount numeric not null,
			paid_at timestamp not null default (now() at time zone 'utc'::text)
		);
	`
	tx.Exec(invoicePaymentsTable)
	functionRegisterInvoicePayment := `
		CREATE OR REPLACE FUNCTION payment_invoice(p_id INTEGER, p_amount numeric)  
		RETURNS VOID AS $$
		DECLARE 
			st text;
			pt integer;
		BEGIN
			RAISE NOTICE 'Starting';
			insert into invoice_payments(invoice_id, amount)
			values (p_id, p_amount);
			
			update invoices 
				set status = case when balance - p_amount > 0 then 'partial_paid' else 'paid' end,
					balance = balance - p_amount
			where id = p_id;

			select status::text into st
			from invoices where id = p_id;

			if st = 'paid' then
				update invoice_items 
					set status = 'paid'
				where invoice_id = p_id;

				UPDATE invoice_items ii
					SET due_date = CURRENT_DATE + INTERVAL '1 day' * p.net_payment_terms
				FROM productions p
				WHERE ii.production_id = p.id and ii.invoice_id = p_id and p.production_billing_type = 'collection';
			end if; 

		END;
		$$ LANGUAGE plpgsql;
	`
	tx.Exec(functionRegisterInvoicePayment)
	// This code is executed when the migration is applied.
	return nil
}

func downAddPaymentRegister(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}
