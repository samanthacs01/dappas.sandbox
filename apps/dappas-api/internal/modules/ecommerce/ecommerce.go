package ecommerce

import (
	"go.uber.org/fx"
	"selector.dev/dappas/internal/modules/ecommerce/endpoints"
	"selector.dev/dappas/internal/modules/ecommerce/repositories"
	"selector.dev/dappas/internal/modules/ecommerce/router"
	"selector.dev/dappas/internal/modules/ecommerce/shopify"
	"selector.dev/dappas/internal/modules/ecommerce/usecases"
)

func ProvideECommerce() fx.Option {
	return fx.Module(
		"E-Commerce", 
		fx.Provide(shopify.NewShopifyCustomerService),
		fx.Provide(repositories.NewCustomersRepository),
		fx.Provide(usecases.NewShopifyInstallUseCase),
		fx.Provide(usecases.NewShopifyAuthCallbackUseCase),
		fx.Provide(endpoints.NewAuthCallbackShopifyEndpoint),
		fx.Provide(endpoints.NewShopifyInstallEndpoint),
		fx.Invoke(router.ShopifyRoute),
	)
}
