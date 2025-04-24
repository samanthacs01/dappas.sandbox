package infrastructure

import (
	"context"

	"go.uber.org/fx"
	"selector.dev/database"
	"selector.dev/pulse/config"
	_ "selector.dev/pulse/internal/infrastructure/database/migrations"
	"selector.dev/pulse/internal/infrastructure/emails"
	"selector.dev/pulse/internal/infrastructure/files"
	repositories "selector.dev/pulse/internal/infrastructure/repositories"
	"selector.dev/pulse/internal/infrastructure/security"
	"selector.dev/pulse/internal/infrastructure/workers"
)

var PulseInfrastructureModule = fx.Module(
	"PulseInfrastructureModule",
	infrastructureProviders(),
)

var PulseInfrastructureMigratorModule = fx.Module(
	"PulseInfrastructureMigratorModule",
	fx.Invoke(func(c config.Config) {
		database.ApplyMigrations(c.GetConStr(), "./internal/infrastructure/database/migrations")
	}),
)

func infrastructureProviders() fx.Option {
	return fx.Options(
		repositoriesProviders(),
		fx.Provide(emails.NewResendEmailSender),
		fx.Provide(files.NewFileUploader),
		fx.Provide(security.NewUserManagement),
		fx.Provide(security.NewSessionService),
		fx.Provide(workers.NewDocumentProcessorWorker),
		fx.Provide(func(ctx context.Context, c config.Config) *database.Conn {
			conn, err := database.InitDBPool(ctx, c.GetConStr())
			if err != nil {
				panic(err)
			}
			return conn
		}),
		fx.Invoke(func(lc fx.Lifecycle, db *database.Conn) {
			lc.Append(fx.Hook{
				OnStop: func(ctx context.Context) error {
					db.Close()
					return nil
				},
			})
		}),
		fx.Invoke(func(c config.Config) {
			if c.IsDevelopment() {
				database.ApplyMigrations(c.GetConStr(), "./internal/infrastructure/database/migrations")
			}
		}),
	)
}

func repositoriesProviders() fx.Option {
	return fx.Options(
		fx.Provide(repositories.NewUserRepository),
		fx.Provide(repositories.NewPayersRepository),
		fx.Provide(repositories.NewProductionsRepository),
		fx.Provide(repositories.NewExpensesRepository),
		fx.Provide(repositories.NewBookingsRepository),
		fx.Provide(repositories.NewInvoicesRepository),
		fx.Provide(repositories.NewBillsRepository),
		fx.Provide(repositories.NewActivityLogRepository),
		fx.Provide(repositories.NewOverviewRepository),
		fx.Provide(repositories.NewAdvertisersRepository),
	)
}
