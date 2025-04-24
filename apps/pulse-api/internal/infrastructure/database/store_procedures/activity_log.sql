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