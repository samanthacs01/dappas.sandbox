package migrations

import (
	"gorm.io/gorm"
	"selector.dev/dappas/internal/modules/ecommerce/entities"
	"selector.dev/database"
)

func init() {
	database.AddMigrationContext(upInstallModels, downInstallModels)
}

func upInstallModels(db *gorm.DB) error {
	// This code is executed when the migration is applied.
	err := db.Migrator().AutoMigrate(&entities.Install{})
	return err
}

func downInstallModels(db *gorm.DB) error {
	// This code is executed when the migration is rolled back.
	err := db.Migrator().DropTable(&entities.Install{})
	return err
}
