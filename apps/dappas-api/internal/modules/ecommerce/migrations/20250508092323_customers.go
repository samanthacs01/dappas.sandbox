package migrations

import (
	"gorm.io/gorm"
	"selector.dev/dappas/internal/modules/ecommerce/entities"
	"selector.dev/database"
)

func init() {
	database.AddMigrationContext(upCustomersModels, downCustomersModels)
}

func upCustomersModels(db *gorm.DB) error {
	// This code is executed when the migration is applied.
	err := db.Migrator().AutoMigrate(&entities.Customer{})
	return err
}

func downCustomersModels(db *gorm.DB) error {
	// This code is executed when the migration is rolled back.
	err := db.Migrator().DropTable(&entities.Customer{})
	return err
}
