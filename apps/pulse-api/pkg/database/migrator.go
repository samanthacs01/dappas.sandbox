package database

import (
	"context"
	"database/sql"
	"fmt"
	"log"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/pressly/goose/v3"
)

func init() {
	goose.SetDialect("pgx")
}
func ApplyMigrations(dbURL string, migrationsDir string) {
	db, err := goose.OpenDBWithDriver("pgx", dbURL)
	if err != nil {
		log.Fatalf("Failed to open DB: %v\n", err)
	}
	defer db.Close()
	
	if err := ensureDbLoggerExists(db); err != nil {
		log.Fatalf("Failed to ensure tracking_changes table exists: %v\n", err)
	}

	if err := goose.Up(db, migrationsDir); err != nil {
		log.Fatalf("Failed to apply migrations: %v\n", err)
	}
	log.Println("Migrations applied successfully")
}


func ensureDbLoggerExists(db *sql.DB) error {
    query := `
    CREATE TABLE IF NOT EXISTS db_logger (
        id SERIAL PRIMARY KEY,
        table_name VARCHAR(100) NOT NULL,
        query TEXT NOT NULL,
        args TEXT NOT NULL,
		action VARCHAR(100) NOT NULL,
        created_by INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    `
    _, err := db.ExecContext(context.Background(), query)
    if err != nil {
        return fmt.Errorf("failed to create tracking_changes table: %w", err)
    }
	query = `ALTER TABLE db_logger ADD COLUMN IF NOT EXISTS action VARCHAR(100) NOT NULL DEFAULT 'INSERT';`
	_, err = db.ExecContext(context.Background(), query)
    if err != nil {
        return fmt.Errorf("failed to create tracking_changes table: %w", err)
    }
	query = `ALTER TABLE db_logger DROP COLUMN IF EXISTS table_identity;`
	_, err = db.ExecContext(context.Background(), query)
    if err != nil {
        return fmt.Errorf("failed to create tracking_changes table: %w", err)
    }
    return nil
}