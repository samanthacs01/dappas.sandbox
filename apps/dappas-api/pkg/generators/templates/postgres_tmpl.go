package templates

var PostgresTmpl = `package postgres

import (
	""go.uber.org/zap"
	"{{.Package}}/internal/modules/{{.Module}}/entity"
	"{{.Package}}/internal/modules/{{.Module}}/repository"
	"selector.dev/database"
)

type {{.ModuleName}}RepositoryImpl struct {
	uow database.UnitOfWork
	logger *zap.Logger
}

func New{{.Name}}Repository(uow database.UnitOfWork, logger *zap.Logger) repository.{{.Name}}Repository {
	return &{{.ModuleName}}RepositoryImpl{uow, logger}
}

func (r *{{.ModuleName}}RepositoryImpl) Find() ([]entity.{{.Name}}, error) {
	panic("implement me")
}

func (r *{{.ModuleName}}RepositoryImpl) FindPage(page, size int) ([]entity.{{.Name}}, int, error) {
	panic("implement me")
}

func (r *{{.ModuleName}}RepositoryImpl) FindById(id int64) (entity.{{.Name}}, error) {
	panic("implement me")
}

func (r *{{.ModuleName}}RepositoryImpl) Update({{.ModuleName}} *entity.{{.Name}}) error {
	panic("implement me")
}

func (r *{{.ModuleName}}RepositoryImpl) Delete({{.ModuleName}} *entity.{{.Name}}) error {
	panic("implement me")
}
func (r *{{.ModuleName}}RepositoryImpl) FindAll() ([]entity.Vendors, error) {
	panic("unimplemented")
}

func (r *{{.ModuleName}}RepositoryImpl) Save(vendors *entity.Vendors) error {
	panic("unimplemented")
}
`
