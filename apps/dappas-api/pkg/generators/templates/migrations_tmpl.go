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
	
func up{{.Name}}Models(db *gorm.DB) error {
	// This code is executed when the migration is applied.
	err := db.Migrator().AutoMigrate(&entities.{{.Name}}{})
	return err
}
	
func down{{.Name}}Models(db gorm.DB) error {
	// This code is executed when the migration is rolled back.
	err := db.Migrator().DropTable(&entities.{{.Name}}{})
	return err
}	
`
