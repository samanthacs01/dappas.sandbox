package templates

var RouterTmpl = `package router

import (
	"{{.Package}}/internal/modules/{{.ModuleName}}/endpoint"
	"github.com/gin-gonic/gin"
)

func Route(
	app *gin.Engine,
) {
	{{.ModuleName}} := app.Group("/v1/{{.ModuleName}}")
}
`
