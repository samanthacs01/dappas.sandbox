package templates

var EndpointTmpl = `package endpoints

import (
	"selector.dev/webapi"
	"{{.Package}}/internal/modules/{{.Module}}/usecases"
	"{{.Package}}/internal/modules/{{.Module}}/models"
)

type {{.Name}}Endpoint struct {
	useCase usecases.I{{.Name}}UseCase
}

func New{{.Name}}Endpoint(useCase usecases.I{{.Name}}UseCase) *{{.Name}}Endpoint {
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
func (e *{{.Name}}Endpoint) Handler(input *models.{{.Name}}Request) webapi.Result {
    success, fail := e.useCase.Run(input)
	if fail != nil {
		return webapi.InternalServerError(fail)
	}
	return webapi.Ok(*success)
}

`
