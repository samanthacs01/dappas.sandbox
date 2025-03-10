package database

import (
	"context"

	"go.uber.org/fx"
	"selector.dev/dappas/internal/app/config"
	"selector.dev/database"
)

func providePostgres(ctx context.Context, c config.IAppConfig) *database.Conn {
	conn, err := database.InitDBPool(ctx, c.GetConnectionString())
	if err != nil {
		panic(err)
	}
	return conn
}

func provideUnitOfWork(conn *database.Conn, ctx context.Context) database.UnitOfWork {
	return database.NewUnitOfWor(conn, ctx)
}

func invokeCloseDb(lc fx.Lifecycle, db *database.Conn) {
	lc.Append(fx.Hook{
		OnStop: func(ctx context.Context) error {
			db.Close()
			return nil
		},
	})
}

func ProvidePostgresDatabase() fx.Option {
	return fx.Options(
		fx.Provide(providePostgres),
		fx.Provide(provideUnitOfWork),
		fx.Invoke(invokeCloseDb),
	)
}
