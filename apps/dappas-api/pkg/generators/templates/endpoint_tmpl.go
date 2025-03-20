package templates

var EndpointTmpl = `package endpoint

import (
	"selector.dev/webapi"
	"{{.Package}}/internal/modules/{{.Module}}/usecase"
	"{{.Package}}/internal/modules/{{.Module}}/model"
)

type {{.Name}}Endpoint struct {
	useCase usecase.I{{.Name}}UseCase
}

func New{{.Name}}Endpoint(useCase usecase.I{{.Name}}UseCase) *{{.Name}}Endpoint {
	return &{{.Name}}Endpoint{
		useCase: useCase,
	}
}

// Handler godoc
// @Summary {{.Name}}
// @Description {{.Module}} {{.ModuleName}} {{.Endpoint}}
// @Tags {{.Feature}}
// @Accept json
// @Produce json
// @Param body body {{.Name}}Input true "Request body"
// @Success 200 {object} {{.Name}}Input
// @Failure 500 {object} ProblemDetails
// @Router /v1/{{.Module}}/{{.ModuleName}}/{{.Name}} [post]
func (e *{{.Name}}Endpoint) Handler(input *model.{{.Name}}Request) webapi.Result {
    success, fail := e.useCase.Run(input)
	if fail != nil {
		return webapi.InternalServerError(fail)
	}
	return webapi.Ok(*success)
}

`
