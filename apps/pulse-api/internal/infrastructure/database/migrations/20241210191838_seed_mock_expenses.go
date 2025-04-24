package migrations

import (
	"context"
	"database/sql"
	"fmt"
	"strings"

	"github.com/jaswdr/faker/v2"
	"github.com/pressly/goose/v3"
)

func init() {
	goose.AddMigrationContext(upSeedMockExpenses, downSeedMockExpenses)
}

func upSeedMockExpenses(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is applied.
	fake := faker.New()

	q := buildQueryInsertExpenses(10, &fake)
	_, error := tx.ExecContext(ctx, q)
	if error != nil {
		return fmt.Errorf("failed to insert expenses: %v", error)
	}

	q = buildQueryInsertExpensesItems(10, &fake)
	_, error = tx.ExecContext(ctx, q)
	if error != nil {
		return fmt.Errorf("failed to insert expenses: %v", error)
	}

	return nil
}

func downSeedMockExpenses(ctx context.Context, tx *sql.Tx) error {
	// This code is executed when the migration is rolled back.
	_, error := tx.ExecContext(ctx, "DELETE FROM expense_items")
	if error != nil {
		return fmt.Errorf("failed to delete expense items: %w", error)
	}
	_, error = tx.ExecContext(ctx, "DELETE FROM expenses")
	if error != nil {
		return fmt.Errorf("failed to delete expenses: %w", error)
	}
	return nil
}

func buildQueryInsertExpenses(count int, f *faker.Faker) string {
	var b = strings.Builder{}
	months := []string{"May", "March", "June", "July", "August", "September", "October", "November", "December", "January", "February", "April"}
	years := []string{"2024", "2023"}
	b.WriteString("INSERT INTO expenses (production_id, \"month\", \"year\") ")

	for i := 0; i < count; i++ {
		if i > 0 {
			b.WriteString(" UNION ALL ")
		}
		b.WriteString("SELECT id, '")
		b.WriteString(f.RandomStringElement(months))
		b.WriteString("', '")
		b.WriteString(f.RandomStringElement(years))
		b.WriteString("' FROM productions")
	}
	return b.String()
}

func buildQueryInsertExpensesItems(count int, f *faker.Faker) string {
	var b = strings.Builder{}

	categories := []string{"Food", "Transport", "Accommodation", "Entertainment", "Other"}

	b.WriteString("INSERT INTO expense_items (expense_id, category, amount)")

	for i := 0; i < count; i++ {
		if i > 0 {
			b.WriteString(" UNION ALL ")
		}
		b.WriteString("SELECT id, '")
		b.WriteString(f.RandomStringElement(categories))
		b.WriteString("', ")
		b.WriteString(fmt.Sprintf("%.2f", f.RandomFloat(3, 1000, 100000)))
		b.WriteString(" FROM expenses")
	}
	return b.String()
}
