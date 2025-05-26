package vendors

import (
	"go.uber.org/fx"
	"selector.dev/dappas/internal/modules/vendors/endpoints"
	"selector.dev/dappas/internal/modules/vendors/repositories"
	"selector.dev/dappas/internal/modules/vendors/router"
	"selector.dev/dappas/internal/modules/vendors/usecases"
)

func ProvideVendors() fx.Option {
	return fx.Module("Vendors",
		fx.Provide(repositories.NewVendorRepository),
		fx.Provide(usecases.NewListVendorsUseCase),
		fx.Provide(endpoints.NewListVendorsEndpoint),
		fx.Invoke(router.Route),
	)
}
