package providers

import (
	"go.uber.org/fx"
	"selector.dev/security/endpoints"
	"selector.dev/security/repositories"
	router "selector.dev/security/route"
	"selector.dev/security/usecases"
)

func SecurityModule() fx.Option {
	return fx.Module(
		"security",
		fx.Provide(usecases.NewLoginUseCase),
		fx.Provide(repositories.NewGoogleUserRepository),
		fx.Provide(repositories.NewUserRepository),
		fx.Provide(endpoints.NewAuthUserEndpoint),
		fx.Invoke(router.Route),
	)
}
