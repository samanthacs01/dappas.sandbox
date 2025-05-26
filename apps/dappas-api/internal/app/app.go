package app

import (
	"context"

	"github.com/gin-gonic/gin"
	"go.uber.org/fx"
	"go.uber.org/zap"
	"selector.dev/dappas/internal/app/config"
	"selector.dev/dappas/internal/app/database"
	"selector.dev/dappas/internal/app/hooks"
	"selector.dev/dappas/internal/app/router"
	"selector.dev/dappas/internal/modules/ecommerce"
	"selector.dev/dappas/internal/modules/vendors"
	security "selector.dev/security/providers"
)

func BuildApp() *fx.App {
	return fx.New(
		fx.Provide(func() context.Context {
			return context.Background()
		}),
		fx.Provide(func() *gin.Engine {
			return gin.Default()
		}),
		fx.Provide(zap.NewDevelopment),
		fx.Provide(config.NewSecurityConfig),
		fx.Provide(config.NewAppConfig),
		fx.Provide(config.NewGoogleConfig),
		fx.Provide(config.NewShopifyConfig),
		fx.Provide(hooks.NewUserSaveHooks),
		database.ProvidePostgresDatabase(),
		security.SecurityModule(),
		vendors.ProvideVendors(),
		ecommerce.ProvideECommerce(),
		router.ProvideRouter(),
		fx.Invoke(startServer),
	)
}
func startServer(lc fx.Lifecycle, g *gin.Engine) {
	lc.Append(fx.Hook{
		OnStart: func(ctx context.Context) error {
			go g.Run()
			return nil
		},
		OnStop: func(ctx context.Context) error {
			return nil
		},
	})
}
