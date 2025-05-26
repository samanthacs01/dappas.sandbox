package database

import (
	"errors"
	"fmt"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"

	"gorm.io/gorm"
)

type SelectorMigration func(migrator *gorm.DB) error

type Migrator interface {
	Up() error
	Down() error
}

type GoMigration struct {
	*gorm.Model
	// Version is the version of the migration.
	Version int64
	// Source is the source of the migration.
	Source string
	// Up is the up migration.
	Up *SelectorMigration `gorm:"-"`
	// Down is the down migration.
	Down *SelectorMigration `gorm:"-"`
}

func NewGoMigration(version int64, source string, up, down *SelectorMigration) *GoMigration {
	return &GoMigration{
		Version: version,
		Up:      up,
		Down:    down,
		Source:  source,
	}
}

var registeredGoMigrations = make(map[int64]*GoMigration)

type selectorMigrator struct {
	db *gorm.DB
}

func NewSelectorMigrator(conn *Conn) Migrator {
	return &selectorMigrator{db: conn.DB}
}

func (m *selectorMigrator) Up() error {
	// This code is executed when the migration is applied.
	return m.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.AutoMigrate(&GoMigration{}); err != nil {
			return fmt.Errorf("failed to apply migrations: %w", err)
		}
		for _, migration := range registeredGoMigrations {
			// Check if the migration already exists.
			if isApplied(tx, migration.Version) {
				continue
			}
			// Apply the migration.
			if err := (*migration.Up)(tx); err != nil {
				return fmt.Errorf("failed to apply migration %q: %w", migration.Source, err)
			}
			if err := tx.Save(&migration).Error; err != nil {
				return fmt.Errorf("failed to save migration %q: %v", migration.Source, err)
			}
		}
		return nil
	})
}

func (m *selectorMigrator) Down() error {
	// This code is executed when the migration is rolled back.
	return m.db.Transaction(func(tx *gorm.DB) error {
		for i := len(registeredGoMigrations) - 1; i >= 0; i-- {
			migration := registeredGoMigrations[int64(i)]
			// Check if the migration already exists.
			if !isApplied(tx, migration.Version) {
				continue
			}
			if err := (*migration.Down)(tx); err != nil {
				return fmt.Errorf("failed to rollback migration %q: %w", migration.Source, err)
			}
			if err := tx.Delete(&migration).Error; err != nil {
				return fmt.Errorf("failed to remove migration %q: %v", migration.Source, err)
			}
		}
		return nil
	})
}

func isApplied(tx *gorm.DB, version int64) bool{
	var count int64
	if err := tx.Model(&GoMigration{}).Where("version = ?", version).Count(&count).Error; err != nil {
		return false
	}
	return count > 0
}

func AddMigrationContext(up, down SelectorMigration) {
	_, filename, _, _ := runtime.Caller(1)
	AddNamedMigrationContext(filename, up, down)
}

// AddNamedMigrationContext adds named Go migrations.
func AddNamedMigrationContext(filename string, up, down SelectorMigration) {
	if err := register(
		filename,
		&up,
		&down,
	); err != nil {
		panic(err)
	}
}

func register(filename string, up, down *SelectorMigration) error {
	v, _ := NumericComponent(filename)
	if existing, ok := registeredGoMigrations[v]; ok {
		return fmt.Errorf("failed to add migration %q: version %d conflicts with %q",
			filename,
			v,
			existing.Source,
		)
	}
	// Add to global as a registered migration.
	m := NewGoMigration(v, filename, up, down)
	registeredGoMigrations[v] = m
	return nil
}

func NumericComponent(filename string) (int64, error) {
	base := filepath.Base(filename)
	if ext := filepath.Ext(base); ext != ".go" && ext != ".sql" {
		return 0, errors.New("migration file does not have .sql or .go file extension")
	}
	idx := strings.Index(base, "_")
	if idx < 0 {
		return 0, errors.New("no filename separator '_' found")
	}
	n, err := strconv.ParseInt(base[:idx], 10, 64)
	if err != nil {
		return 0, fmt.Errorf("failed to parse version from migration file: %s: %w", base, err)
	}
	if n < 1 {
		return 0, errors.New("migration version must be greater than zero")
	}
	return n, nil
}
