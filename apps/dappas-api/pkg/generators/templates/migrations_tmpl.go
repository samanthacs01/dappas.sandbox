package templates

var MigrationsTmpl = `package migrations
import (
	"gorm.io/gorm"
	"selector.dev/database"
	"{{.Package}}/internal/modules/{{.Module}}/entities"
)
	
func init() {
	database.AddMigrationContext(up{{.Name}}Models, down{{.Name}}Models)
}
	
func up{{.Name}}Models(migrator gorm.Migrator) error {
	// This code is executed when the migration is applied.
	err := migrator.AutoMigrate(&entities.{{.Name}}{})
	return err
}
	
func down{{.Name}}Models(migrator gorm.Migrator) error {
	// This code is executed when the migration is rolled back.
	err := migrator.DropTable(&entities.{{.Name}}{})
	return err
}	
`
