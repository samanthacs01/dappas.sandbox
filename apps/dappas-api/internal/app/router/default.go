package router

import (
	"net/http"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"go.uber.org/fx"
	secModel "selector.dev/security/model"
	security "selector.dev/security/use_cases"
)

func ProvideRouter() fx.Option {
	return fx.Options(
		fx.Invoke(healthCheck),
		fx.Invoke(swaggerRoutes),
	)
}

func healthCheck(router *gin.Engine) {
	router.GET("/", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{"status": "ok"})
	})
}

func swaggerRoutes(router *gin.Engine, s security.ILoginUseCase) {
	router.GET("/swagger/*any", basicAuth(s), ginSwagger.WrapHandler(swaggerFiles.Handler))
}

func basicAuth(s security.ILoginUseCase) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		email, pass, hasAuth := ctx.Request.BasicAuth()
		input := secModel.LoginInput{
			Email:    email,
			Password: pass,
		}
		_, err := s.Run(input)
		if err != nil {
			ctx.Header("WWW-Authenticate", `Basic realm="Restricted"`)
			ctx.AbortWithStatus(http.StatusUnauthorized)
		}
		if hasAuth {
			ctx.Next()
			return
		}
		ctx.Header("WWW-Authenticate", `Basic realm="Restricted"`)
		ctx.AbortWithStatus(http.StatusUnauthorized)
	}
}
