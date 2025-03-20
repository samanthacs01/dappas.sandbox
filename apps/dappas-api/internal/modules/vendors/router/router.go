package router

import (
	"github.com/gin-gonic/gin"
	"selector.dev/dappas/internal/modules/vendors/endpoint"
	"selector.dev/webapi"
)

func Route(
	app *gin.Engine,
	saveEndpoint *endpoint.SaveEndpoint,
) {
	vendors := app.Group("/v1/vendors")
	{
		vendors.POST("/save", webapi.GinHandler(saveEndpoint.Handler))
	}
}
