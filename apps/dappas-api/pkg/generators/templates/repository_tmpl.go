package templates

var RepositoryTmpl = `package repositories

import (
	"go.uber.org/zap"
	"selector.dev/database"
	"{{.Package}}/internal/modules/{{.Module}}/entities"
	"{{.Package}}/internal/modules/{{.Module}}/repositories/postgres"
)

type {{.Name}}Repository interface {
	Save({{.ModuleName}} *entities.{{.Name}}) error
	FindAll() (*[]entities.{{.Name}}, error)
	FindPage(page, size int) (*[]entities.{{.Name}}, *int64, error)
	FindById(id int64) (*entities.{{.Name}}, error)
	Delete({{.ModuleName}} *entities.{{.Name}}) error
}
	
func New{{.Name}}Repository(conn *database.Conn, logger *zap.Logger) {{.Name}}Repository {
	return postgres.NewPostgres{{.Name}}Repository(conn, logger)
}
`
