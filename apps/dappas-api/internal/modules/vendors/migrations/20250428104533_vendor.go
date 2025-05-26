package migrations

import (
	"gorm.io/gorm"
	"selector.dev/dappas/internal/modules/vendors/entities"
	"selector.dev/database"
)

func init() {
	database.AddMigrationContext(upVendorModels, downVendorModels)
}

func upVendorModels(db *gorm.DB) error {
	// This code is executed when the migration is applied.
	err := db.Migrator().AutoMigrate(&entities.Vendor{})
	return err
}

func downVendorModels(db *gorm.DB) error {
	// This code is executed when the migration is rolled back.
	err := db.Migrator().DropTable(&entities.Vendor{})
	return err
}
