package main

import (
	"context"

	"go.uber.org/fx"
	"go.uber.org/zap"
	"selector.dev/dappas/internal/app/config"
	db "selector.dev/dappas/internal/app/database"
	_ "selector.dev/security/migrations"
)

func main() {
	ctx := context.Background()
	app := buildApp()
	app.Start(ctx)
}

func buildApp() *fx.App {
	return fx.New(
		fx.Provide(func() context.Context {
			return context.Background()
		}),
		fx.Options(
			fx.Provide(config.NewAppConfig),
		),
		fx.Provide(zap.NewDevelopment),
		db.ProvidePostgresMigratorDatabase(),
	)
}
