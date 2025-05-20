package router

import (
	"github.com/gin-gonic/gin"
	"selector.dev/dappas/internal/app/config"
	"selector.dev/dappas/internal/modules/ecommerce/endpoints"
	"selector.dev/dappas/internal/modules/ecommerce/router/middleware"
	"selector.dev/webapi"
)

func ShopifyRoute(
	app *gin.Engine,
	config config.IShopifyConfig,
	installEpt *endpoints.InstallShopifyEndpoint,
	authCallbackEpt *endpoints.AuthCallbackShopifyEndpoint,
) {
	shopify := app.Group("/v1/ecommerce/shopify")
	{
		shopify.POST("/webhook", middleware.HmacValidationMiddleware(config))
		shopify.GET("/install", webapi.GinHandler(installEpt.Handler))
		shopify.GET("/auth-callback", webapi.GinHandler(authCallbackEpt.Handler))
	}
}
