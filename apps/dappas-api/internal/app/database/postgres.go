package database

import (
	"context"

	"go.uber.org/fx"
	"go.uber.org/zap"
	"selector.dev/dappas/internal/app/config"
	"selector.dev/database"
)

func providePostgres(ctx context.Context, c config.IAppConfig) *database.Conn {
	conn, err := database.InitGormConnection(ctx, c.GetConnectionString())
	if err != nil {
		panic(err)
	}
	return conn
}

func ProvidePostgresMigratorDatabase() fx.Option {
	return fx.Options(
		fx.Provide(database.NewSelectorMigrator),
		fx.Provide(providePostgres),
		fx.Invoke(runMigration),
	)
}

func runMigration(c config.IAppConfig, migrator database.Migrator, logger *zap.Logger) {
	logger.Info("Running migrations")
	if err := migrator.Up(); err != nil {
		logger.Error("Failed to run migrations", zap.Error(err))
		panic(err)
	}
	logger.Info("Migrations completed")
}

func ProvidePostgresDatabase() fx.Option {
	return fx.Options(
		fx.Provide(providePostgres),
	)
}
