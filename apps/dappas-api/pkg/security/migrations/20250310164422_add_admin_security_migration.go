package migrations

import (
	"context"
	"database/sql"
	"fmt"
	"os"

	"github.com/pressly/goose/v3"
	"golang.org/x/crypto/bcrypt"
)

func init() {
	goose.AddMigrationContext(upAddAdminSecurityMigration, downAddAdminSecurityMigration)
}

func upAddAdminSecurityMigration(ctx context.Context, tx *sql.Tx) error {
	email := getEnv("DAPPAS_ADMIN_EMAIL", "")
	password := getEnv("DAPPAS_ADMIN_PASSWORD", "")
	firstName := getEnv("DAPPAS_ADMIN_FIRST_NAME", "")
	lastName := getEnv("DAPPAS_ADMIN_LAST_NAME", "")
	role := "admin"
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash password: %v", err)
	}
	_, err = tx.ExecContext(ctx, `
        INSERT INTO users (email, password, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5)
    `, email, passwordHash, firstName, lastName, role)
	if err != nil {
		return err
	}
	return nil
}

func downAddAdminSecurityMigration(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.

	return nil
}

func getEnv(key, defaultValue string) string {
	value, exists := os.LookupEnv(key)
	if !exists || len(value) == 0 {
		return defaultValue
	}
	return value
}
