package vendors

import (
	"go.uber.org/fx"
	// "selector.dev/dappas/internal/app/config"

	"selector.dev/dappas/internal/modules/vendors/repository/postgres"
	"selector.dev/dappas/internal/modules/vendors/router"
)

func ProvideVendors() fx.Option {
	return fx.Module("Vendors",
		fx.Invoke(router.Route),
		fx.Invoke(postgres.NewVendorsRepository),
	)
}
