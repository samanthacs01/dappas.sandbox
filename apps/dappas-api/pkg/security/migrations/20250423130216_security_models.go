package migrations

import (
	"fmt"
	"os"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"selector.dev/database"
	"selector.dev/security/entities"
)

func init() {
	database.AddMigrationContext(upSecurityModels, downSecurityModels)
}

func upSecurityModels(db *gorm.DB) error {

	// This code is executed when the migration is applied.
	if err := db.Migrator().AutoMigrate(&entities.User{}, &entities.Session{}); err != nil {
		return err
	}

	email := getEnv("DAPPAS_ADMIN_EMAIL", "")
	password := getEnv("DAPPAS_ADMIN_PASSWORD", "")
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash password: %v", err)
	}
	admin := &entities.User{
		Password: string(passwordHash),
		Email:    email,
		Role:     string(entities.RoleAdmin),
	}
	if err := db.Save(admin).Error; err != nil {
		return fmt.Errorf("failed to save admin user: %v", err)
	}
	return nil
}

func downSecurityModels(db *gorm.DB) error {
	// This code is executed when the migration is rolled back.
	err := db.Migrator().DropTable(&entities.Session{}, &entities.User{})
	return err
}

func getEnv(key, defaultValue string) string {
	value, exists := os.LookupEnv(key)
	if !exists || len(value) == 0 {
		return defaultValue
	}
	return value
}
