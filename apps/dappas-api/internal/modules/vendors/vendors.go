package vendors

import (
	"go.uber.org/fx"
	// "selector.dev/dappas/internal/app/config"

	"selector.dev/dappas/internal/modules/vendors/endpoint"
	"selector.dev/dappas/internal/modules/vendors/repository/postgres"
	"selector.dev/dappas/internal/modules/vendors/router"
	"selector.dev/dappas/internal/modules/vendors/usecase"
)

func ProvideVendors() fx.Option {
	return fx.Module("Vendors",
		fx.Provide(postgres.NewVendorsRepository),
		fx.Provide(usecase.NewSaveUseCase),
		fx.Provide(endpoint.NewSaveEndpoint),
		fx.Invoke(router.Route),
	)
}
