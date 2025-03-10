package users

import (
	"go.uber.org/fx"
	"selector.dev/dappas/internal/modules/users/endpoint"
	"selector.dev/dappas/internal/modules/users/router"
)

func ProvideUsers() fx.Option {
	return fx.Module(
		"Users",
		fx.Provide(endpoint.NewLoginEndpoint),
		fx.Invoke(router.Route),
	)
}
