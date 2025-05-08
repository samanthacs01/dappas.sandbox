package router

import (
	"github.com/gin-gonic/gin"
	"selector.dev/dappas/internal/modules/vendors/endpoints"
	"selector.dev/webapi"
)

func Route(
	app *gin.Engine,
	listVendors *endpoints.ListVendorsEndpoint,
) {
	vendors := app.Group("/v1/vendors")
	{
		vendors.GET("", webapi.GinHandler(listVendors.Handler))
	}
}
