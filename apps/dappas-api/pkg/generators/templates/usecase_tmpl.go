package templates

var UsecaseTmpl = `package usecase

import (
	"errors"
	"{{.Package}}/internal/modules/{{.Module}}/repository"
	"{{.Package}}/internal/modules/{{.Module}}/model"
)

//go:generate mockgen -destination=../mocks/mock_{{.Endpoint}}_usecase.go -package=mocks {{.Package}}/usecase I{{.Name}}UseCase
type I{{.Name}}UseCase interface {
	Run(input *model.{{.Name}}Input) (*model.{{.Name}}Output, error)
}

type {{.InternalName}}UseCase struct {
	Repository repository.{{.Feature}}Repository
}

func New{{.Name}}UseCase(repository repository.{{.Feature}}Repository) I{{.Name}}UseCase {
	return &{{.InternalName}}UseCase{
		Repository: repository,
	}
}

func (u *{{.InternalName}}UseCase) Run(input *model.{{.Name}}Input) (*model.{{.Name}}Output, error) {
	return nil, errors.New("not implemented")
}
	
`
