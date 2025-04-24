package main

import (
	"context"

	"go.uber.org/fx"
	"go.uber.org/zap"
	"selector.dev/pulse/config"
	shared "selector.dev/pulse/internal/infrastructure"
)

type User struct {
	ID    int `db:"auto"`
	Email string
}

func main() {
	ctx := context.Background()
	app := buildApp()
	app.Start(ctx)
}

func buildApp() *fx.App {
	return fx.New(
		fx.Options(
			fx.Provide(config.NewConfig),
			fx.Provide(config.NewEmailConfig),
			fx.Provide(config.NewFileManagerConfig),
		),
		fx.Provide(zap.NewDevelopment),
		shared.PulseInfrastructureMigratorModule,
	)
}
