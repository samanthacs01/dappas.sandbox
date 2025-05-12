package ecommerce

import (
	"go.uber.org/fx"
	"selector.dev/dappas/internal/modules/ecommerce/repositories"
	"selector.dev/dappas/internal/modules/ecommerce/router"
	"selector.dev/dappas/internal/modules/ecommerce/shopify"
)

func ProvideECommerce() fx.Option {
	return fx.Module(
		"E-Commerce", 
		fx.Provide(shopify.NewShopifyCustomerService),
		fx.Provide(repositories.NewCustomersRepository),
		fx.Invoke(router.Route),
	)
}
