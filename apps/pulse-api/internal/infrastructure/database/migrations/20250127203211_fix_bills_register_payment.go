package migrations

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upFixBillsRegisterPayment, downFixBillsRegisterPayment)
}

func upFixBillsRegisterPayment(ctx context.Context, tx *sql.Tx) error {
	err := fixStoreProcedurePaymentBillWhenAddUserId(tx)
	return err
}

func downFixBillsRegisterPayment(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}

func fixStoreProcedurePaymentBillWhenAddUserId(tx *sql.Tx) error {
	if _, err := tx.Exec(`DROP FUNCTION if exists payment_bill(int4, numeric);`); err != nil {
		fmt.Println("Error dropping function payment_bill", err)
		return err
	}
	_, err := tx.Exec(`CREATE OR REPLACE FUNCTION payment_bill(p_id integer, p_amount numeric, p_user_id integer)
		RETURNS void
		LANGUAGE plpgsql
		AS $function$
				DECLARE 
					st text;
					pt integer;
					b_deduction numeric;
					b_amount numeric;
					b_revenue numeric;
					b_retention numeric;
					bb record;
				BEGIN
					RAISE NOTICE 'Starting';
					insert into bill_payments(bill_id, amount, change_by)
					values (p_id, p_amount, p_user_id::text);
					
					update bills 
						set status = case when balance - p_amount > 0 then 'partial_paid' else 'paid' end,
							balance = case when balance - p_amount > 0 then balance - p_amount else 0 end,
							change_by = p_user_id::text
					where id = p_id;

				END;
				$function$
		;`)
	if err != nil {
		fmt.Println("Error creating function payment_bill", err)
	}
	return err
}
