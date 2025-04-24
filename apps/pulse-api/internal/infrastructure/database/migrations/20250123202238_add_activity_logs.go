package migrations

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upAddActivityLogs, downAddActivityLogs)
}

func upAddActivityLogs(ctx context.Context, tx *sql.Tx) error {
	if err := _addTableAndTriggerFunctionToActivityLogs(tx); err != nil {
		return err
	}
	tables := []string{"users", "invoices", "invoice_items", "bills", "bill_payments", "invoice_payments", "insertion_orders", "flights", "io_drafts", "io_draft_flights", "expenses", "expense_docs", "payers", "productions"}
	for _, table := range tables {
		if err := _addAllActivityLogsTriggerToAuditableTables(table, tx); err != nil {
			return err
		}
	}
	return nil
}

func downAddActivityLogs(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	return nil
}

func _addTableAndTriggerFunctionToActivityLogs(tx *sql.Tx) error {
	// Add table activity_logs
	activityLogsTableDDL := `create table if not exists activity_logs (
		id serial primary key,
		action_at timestamp not null default (now() at time zone 'utc'::text),
		action_type varchar(50),
		entity_name varchar(100),
		entity_id varchar(100),
		own_by varchar(100),
		old_data json,
		new_data json
	);`
	if _, err := tx.Exec(activityLogsTableDDL); err != nil {
		fmt.Println("Error creating table activity_logs: ", err)
		return err
	}

	viewActivityLogsViewDDL := `create or replace view view_activity_logs as
		select 
			l.id,
			l.action_at,
			case when u.id is null then l.own_by else u.email end own_by,
			l.entity_name as entity,
			l.entity_id,
			l.action_type as action,
			(case when l.action_type = 'DELETE' then l.old_data else l.new_data end) as action_data
		from activity_logs l left join users u on l.own_by = u.id::text`
	if _, err := tx.Exec(viewActivityLogsViewDDL); err != nil {
		fmt.Println("Error creating view view_activity_logs: ", err)
		return err
	}

	functionTakeDiffFromJsonDDL := `CREATE OR REPLACE FUNCTION json_diff(old_row JSON, new_row JSON)
		RETURNS JSON AS $$
		DECLARE
			result JSON := '{}';
			key TEXT;
			old_value JSONB;
			new_value JSONB;
		BEGIN
			FOR key IN SELECT jsonb_object_keys(old_row::jsonb)
			LOOP
				old_value := old_row::jsonb -> key;
				new_value := new_row::jsonb -> key;
				
				IF old_value IS DISTINCT FROM new_value THEN
					result := jsonb_set(result::jsonb, ARRAY[key], new_value);
				END IF;
			END LOOP;

			RETURN result;
		END;
		$$ LANGUAGE plpgsql;`
	if _, err := tx.Exec(functionTakeDiffFromJsonDDL); err != nil {
		fmt.Println("Error creating function json_diff: ", err)
		return err
	}

	functionToTriggersActivityLogsDDL := `
		CREATE OR REPLACE FUNCTION log_activity()
		RETURNS TRIGGER AS $$
		DECLARE
			old_data_json JSON;
			new_data_json JSON;
			changes_json JSON;
			before_json JSON;
			user_id_value TEXT;
			action_type_value varchar(50);
			column_exists BOOLEAN;
		BEGIN
			action_type_value := TG_OP;

			-- Determine the user_id from NEW or OLD
			IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
				user_id_value := NEW.change_by;
			ELSE
				user_id_value := OLD.change_by;
			END IF;

				-- Check if the column "deleted_at" exists in the table
		SELECT EXISTS (
			SELECT 1
			FROM information_schema.columns
			WHERE table_name = TG_TABLE_NAME
			AND column_name = 'deleted_at'
		) INTO column_exists;

			-- Convert OLD and NEW records to JSON
			IF TG_OP = 'UPDATE' THEN
				old_data_json := row_to_json(OLD);
				new_data_json := row_to_json(NEW);
				changes_json := json_diff(old_data_json, new_data_json);
				before_json := json_diff(new_data_json, old_data_json);

				-- Check for soft delete if "deleted_at" exists
				IF column_exists AND NEW.deleted_at IS NOT NULL THEN
					action_type_value := 'SOFT DELETE';
				END IF;
			ELSIF TG_OP = 'DELETE' THEN
				before_json := row_to_json(OLD);
			ELSIF TG_OP = 'INSERT' THEN
				changes_json := row_to_json(NEW);
			END IF;

			-- Insert a record into activity_logs
			INSERT INTO activity_logs (
				action_type,
				entity_name,
				entity_id,
				own_by,
				old_data,
				new_data
			) VALUES (
				TG_OP, -- The operation type: INSERT, UPDATE, DELETE
				TG_TABLE_NAME, -- The name of the table
				COALESCE(NEW.id, OLD.id)::text, -- The ID of the entity
				user_id_value, -- The user performing the action
				before_json,
				changes_json
			);

			RETURN NULL;
		END;
		$$ LANGUAGE plpgsql;
	`
	if _, err := tx.Exec(functionToTriggersActivityLogsDDL); err != nil {
		fmt.Println("Error creating function log_activity: ", err)
		return err
	}
	return nil
}

func _addAllActivityLogsTriggerToAuditableTables(tableName string, tx *sql.Tx) error {
	// Add user column to table if no exists
	alterTableDDL := `ALTER TABLE %s ADD COLUMN IF NOT EXISTS change_by VARCHAR(100);`
	if _, err := tx.Exec(fmt.Sprintf(alterTableDDL, tableName)); err != nil {
		fmt.Println("Error adding column change_by to table: ", err)
		return err
	}
	// DROP trigger log_activity_insert
	if err := _dropTriggerIfExists(tx, fmt.Sprintf("log_%s_insert", tableName), tableName); err != nil {
		return err
	}

	// Add trigger log_activity_insert
	insertTriggerDDL := `CREATE TRIGGER log_%s_insert AFTER INSERT ON public.%s FOR EACH ROW EXECUTE FUNCTION log_activity();`
	if _, err := tx.Exec(fmt.Sprintf(insertTriggerDDL, tableName, tableName)); err != nil {
		fmt.Println("Error creating trigger: ", err)
		return err
	}

	// DROP trigger log_activity_update
	if err := _dropTriggerIfExists(tx, fmt.Sprintf("log_%s_update", tableName), tableName); err != nil {
		return err
	}

	// Add trigger log_activity_update
	updateTriggerDDL := `CREATE TRIGGER log_%s_update AFTER UPDATE ON public.%s FOR EACH ROW WHEN (OLD.* IS DISTINCT FROM NEW.*) EXECUTE FUNCTION log_activity();`
	if _, err := tx.Exec(fmt.Sprintf(updateTriggerDDL, tableName, tableName)); err != nil {
		fmt.Println("Error creating trigger: ", err)
		return err
	}

	// DROP trigger log_activity_delete
	if err := _dropTriggerIfExists(tx, fmt.Sprintf("log_%s_delete", tableName), tableName); err != nil {
		return err
	}
	// Add trigger log_activity_delete
	deletedTriggerDDL := `CREATE TRIGGER log_%s_delete AFTER DELETE ON public.%s FOR EACH ROW EXECUTE FUNCTION log_activity();`
	if _, err := tx.Exec(fmt.Sprintf(deletedTriggerDDL, tableName, tableName)); err != nil {
		fmt.Println("Error creating trigger : ", err)
		return err
	}

	return nil
}

func _dropTriggerIfExists(tx *sql.Tx, triggerName string, tableName string) error {
	_dropTriggers := `
		DO $$
		BEGIN
			IF EXISTS (
				SELECT 1
				FROM pg_trigger
				WHERE tgname = '%s'
				AND tgrelid = '%s'::regclass
			) THEN
				EXECUTE 'DROP TRIGGER %s ON %s';
			END IF;
		END $$;`
	if _, err := tx.Exec(fmt.Sprintf(_dropTriggers, triggerName, tableName, triggerName, tableName)); err != nil {
		fmt.Println("Error dropping trigger: ", err)
		return err
	}
	return nil
}
