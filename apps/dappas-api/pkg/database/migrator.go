package database

import (
	"log"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/pressly/goose/v3"
)

func init() {
	goose.SetDialect("pgx")
}
func ApplyMigrations(dbURL string, migrationsDir []string) {
	db, err := goose.OpenDBWithDriver("pgx", dbURL)
	if err != nil {
		log.Fatalf("Failed to open DB: %v\n", err)
	}
	defer db.Close()

	for _, dir := range migrationsDir {
		if err := goose.Up(db, dir); err != nil {
			log.Fatalf("Failed to apply migrations: %v\n", err)
		}
	}
	
	log.Println("Migrations applied successfully")
}