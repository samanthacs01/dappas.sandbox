package ecommerce

import (
	"go.uber.org/fx"
	"selector.dev/dappas/internal/modules/ecommerce/router"
)

func ProvideECommerce() fx.Option {
	return fx.Module("E-Commerce", fx.Invoke(router.Route))
}
