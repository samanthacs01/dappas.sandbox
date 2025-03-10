package templates

var ProviderTmpl = `package {{.ModuleName}}

import (
	"go.uber.org/fx"
	"{{.Package}}/internal/app/config"
	"{{.Package}}/internal/modules/{{.ModuleName}}/router"
)

func Provide{{.Name}}() fx.Option {
	return fx.Module("{{.Name}}", fx.Invoke(router.Route))
}
`
