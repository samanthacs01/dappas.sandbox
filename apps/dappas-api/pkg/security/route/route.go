package router

import (
	"github.com/gin-gonic/gin"
	"selector.dev/security/endpoints"
	"selector.dev/webapi"
)

func Route(
	app *gin.Engine,
	authInternalUser *endpoints.AuthUserEndpoint,
) {
	security := app.Group("/v1/security")
	{
		security.POST("/auth", webapi.GinHandler(authInternalUser.Handler))
	}
	_ = app.Group("/v1/users")
}
