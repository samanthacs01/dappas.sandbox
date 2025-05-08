package router

import (
	"github.com/gin-gonic/gin"
	"selector.dev/dappas/internal/app/config"
	"selector.dev/dappas/internal/modules/ecommerce/router/middleware"
)

func Route(
	app *gin.Engine,
	config config.IAppConfig,
) {
	shopify := app.Group("/v1/ecommerce/shopify")
	{
		shopify.POST("/webhook", middleware.HmacValidationMiddleware(config))
	}
}
