package router

import (
	"github.com/gin-gonic/gin"
	"selector.dev/dappas/internal/modules/users/endpoint"
	"selector.dev/webapi"
)

func Route(
	app *gin.Engine,
	loginEndpoint *endpoint.LoginEndpoint,
) {
	users := app.Group("/v1/users")
	{
		users.POST("/login", webapi.GinHandler(loginEndpoint.Handler))
	}
}
