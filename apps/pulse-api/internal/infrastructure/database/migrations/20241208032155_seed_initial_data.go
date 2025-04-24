package migrations

import (
	"context"
	"database/sql"
	"fmt"
	"os"
	"strings"

	"github.com/jaswdr/faker/v2"
	"github.com/pressly/goose/v3"
	"golang.org/x/crypto/bcrypt"
)

func init() {
	goose.AddMigrationContext(upSeeInitialData, downSeeInitialData)
}

func upSeeInitialData(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is applied.
	fake := faker.New()
	qu := "INSERT INTO users (email, role, password_hash, active) VALUES ($1, $2, $3, true) ON CONFLICT DO NOTHING"
	adminPass := getEnv("PULSE_ADMIN_PASSWORD", "")
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(adminPass), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash password: %v", err)
	}

	_, err = tx.ExecContext(ctx, qu, "admin@pulse.com", "admin", string(passwordHash))
	if err != nil {
		return fmt.Errorf("failed to insert payers: %v", err)
	}

	q := buildQueryInsertPayers(100, &fake)
	_, err = tx.ExecContext(ctx, q)
	if err != nil {
		return fmt.Errorf("failed to insert payers: %v", err)
	}

	q = buildQueryInsertProductions(100, &fake)
	_, err = tx.ExecContext(ctx, q)
	if err != nil {
		return fmt.Errorf("failed to insert productions: %v", err)
	}

	return nil
}

func downSeeInitialData(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	_, err := tx.ExecContext(ctx, "DELETE FROM payers")
	if err != nil {
		return fmt.Errorf("failed to delete payers: %w", err)
	}
	return nil
}

func buildQueryInsertPayers(count int, f *faker.Faker) string {
	var b = strings.Builder{}
	b.WriteString("INSERT INTO payers (entity_name, entity_address, contact_name, contact_phone_number, contact_email) VALUES ")
	for i := 0; i < count; i++ {
		name := f.Company().Name()
		address := f.Address().Address()
		b.WriteString("(")
		b.WriteString("'")
		b.WriteString(sanitizeString(name))
		b.WriteString("', '")
		b.WriteString(sanitizeString(address))
		b.WriteString("', '")
		b.WriteString(sanitizeString(f.Person().Name()))
		b.WriteString("', '")
		b.WriteString(f.Phone().Number())
		b.WriteString("', '")
		b.WriteString(f.Internet().Email())
		b.WriteString("')")
		if i < count-1 {
			b.WriteString(",")
		}
	}
	return b.String()
}

func buildQueryInsertProductions(count int, f *faker.Faker) string {
	var b = strings.Builder{}
	b.WriteString("INSERT INTO productions (entity_name, address, contact_name, contact_phone_number, contact_email, production_split, production_billing_type, production_expense_discount_type) VALUES ")
	for i := 0; i < count; i++ {
		b.WriteString("(")
		b.WriteString("'")
		b.WriteString(sanitizeString(f.Company().Name()))
		b.WriteString("', '")
		b.WriteString(sanitizeString(f.Address().Address()))
		b.WriteString("', '")
		b.WriteString(sanitizeString(f.Person().Name()))
		b.WriteString("', '")
		b.WriteString(f.Phone().Number())
		b.WriteString("', '")
		b.WriteString(f.Internet().Email())
		b.WriteString("', ")
		b.WriteString(fmt.Sprintf("%f", f.Float32(2, 40, 60)))
		b.WriteString(", '")
		b.WriteString(f.RandomStringElement([]string{"billing", "collection"}))
		b.WriteString("', '")
		b.WriteString(f.RandomStringElement([]string{"before", "after"}))
		b.WriteString("')")
		if i < count-1 {
			b.WriteString(",")
		}
	}
	return b.String()
}

func sanitizeString(input string) string {
	replacer := strings.NewReplacer(
		"'", "''",
		"--", "",
		";", "",
	)
	return replacer.Replace(input)
}

func getEnv(key, defaultValue string) string {
	value, exists := os.LookupEnv(key)
	if !exists || len(value) == 0 {
		return defaultValue
	}
	return value
}
