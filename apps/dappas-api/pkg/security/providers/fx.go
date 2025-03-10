package providers

import (
	"go.uber.org/fx"
	"selector.dev/security/repositories"
	"selector.dev/security/use_cases"
)

func SecurityModule() fx.Option {
	return fx.Module(
		"security",
		fx.Provide(use_cases.NewLoginUseCase),
		fx.Provide(repositories.NewUserRepository),
	)
}
