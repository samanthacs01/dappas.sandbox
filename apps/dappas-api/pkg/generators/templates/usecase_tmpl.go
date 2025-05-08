package templates

var UsecaseTmpl = `package usecases

import (
	"errors"
	"{{.Package}}/internal/modules/{{.Module}}/repositories"
	"{{.Package}}/internal/modules/{{.Module}}/models"
)

//go:generate mockgen -destination=../mocks/mock_{{.Endpoint}}_usecase.go -package=mocks {{.Package}}/internal/modules/{{.Module}}/usecases I{{.Name}}UseCase
type I{{.Name}}UseCase interface {
	Run(input *models.{{.Name}}Input) (*models.{{.Name}}Output, error)
}

type {{.InternalName}}UseCase struct {
	Repository repositories.{{.Feature}}Repository
}

func New{{.Name}}UseCase(repository repositories.{{.Feature}}Repository) I{{.Name}}UseCase {
	return &{{.InternalName}}UseCase{
		Repository: repository,
	}
}

func (u *{{.InternalName}}UseCase) Run(input *models.{{.Name}}Input) (*models.{{.Name}}Output, error) {
	return nil, errors.New("not implemented")
}
	
`
