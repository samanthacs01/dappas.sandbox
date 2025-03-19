package lookups

import (
	"go.uber.org/fx"
	"selector.dev/dappas/internal/modules/lookups/repository/postgres"
	"selector.dev/dappas/internal/modules/lookups/router"
)

func ProvideLookups() fx.Option {
	return fx.Module("Lookups",
		fx.Invoke(router.Route),
		fx.Invoke(postgres.NewProductsRepository),
	)
}
