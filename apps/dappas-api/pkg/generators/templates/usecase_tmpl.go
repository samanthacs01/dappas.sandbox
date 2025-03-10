package templates

var UsecaseTmpl = `package usecase

import (
	"errors"
	"{{.Package}}/internal/modules/{{.Module}}/repository"
	"{{.Package}}/internal/modules/{{.Module}}/model"
)

//go:generate mockery --name=I{{.Name}}UseCase --output=mocks --outpkg=mocks --filename={{.Endpoint}}_usecase_mock.go
type I{{.Name}}UseCase interface {
	Do(input *model.{{.Name}}Request) (*model.{{.Name}}Response, error)
}

type {{.InternalName}}UseCase struct {
	Repository repository.{{.Feature}}Repository
}

func New{{.Name}}UseCase(repository *repository.{{.Feature}}Repository) I{{.Name}}UseCase {
	return &{{.InternalName}}UseCase{
		Repository: *repository,
	}
}

func (u *{{.InternalName}}UseCase) Do(input *model.{{.Name}}Request) (*model.{{.Name}}Response, error) {
	return nil, errors.New("not implemented")
}
	
`
