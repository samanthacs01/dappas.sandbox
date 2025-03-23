package templates

var RepositoryTmpl = `package repository

import (
	"{{.Package}}/internal/modules/{{.Module}}/entity"
)

type {{.Name}}Repository interface {
	Save({{.ModuleName}} *entity.{{.Name}}) (*int64, error)
	FindAll() ([]entity.{{.Name}}, error)
	FindPage(page, size int) ([]entity.{{.Name}}, int, error)
	FindById(id int64) (entity.{{.Name}}, error)
	Update({{.ModuleName}} *entity.{{.Name}}) error
	Delete({{.ModuleName}} *entity.{{.Name}}) error
}
`
