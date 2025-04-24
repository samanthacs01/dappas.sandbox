package main

import (
	"context"

	"github.com/gin-gonic/gin"
	"go.uber.org/fx"
	"go.uber.org/zap"
	"selector.dev/pulse/config"
	_ "selector.dev/pulse/docs"
	"selector.dev/pulse/internal/application"
	"selector.dev/pulse/internal/infrastructure"
	"selector.dev/pulse/internal/presentation"
)

//	@title			Swagger Pulse API
//	@version		2.0
//	@description	MVP Pulse-API description.
//	@termsOfService	http://swagger.io/terms/

//	@contact.name	API Support
//	@contact.url	http://www.swagger.io/support
//	@contact.email	support@swagger.io

//	@license.name	Apache 2.0
//	@license.url	http://www.apache.org/licenses/LICENSE-2.0.html

//	@BasePath	/

// @securityDefinitions.apikey	BearerAuth
// @in							header
// @name						Authorization
// @description				Description for what is this security definition being used
func main() {
	app := buildApp()
	app.Run()
}

func buildApp() *fx.App {
	return fx.New(
		fx.Provide(func() context.Context {
			return context.Background()
		}),
		fx.Provide(func() *gin.Engine {
			return gin.Default()
		}),
		fx.Options(
			fx.Provide(config.NewConfig),
			fx.Provide(config.NewEmailConfig),
			fx.Provide(config.NewFileManagerConfig),
			fx.Provide(config.NewWorkerConfig),
		),
		fx.Provide(zap.NewDevelopment),
		infrastructure.PulseInfrastructureModule,
		application.PulseApplicationModule,
		presentation.PulsePresentationModule,
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
