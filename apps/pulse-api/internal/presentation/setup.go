package presentation

import (
	"context"

	"go.uber.org/fx"
	"selector.dev/pulse/internal/domain/shared/services"
	"selector.dev/pulse/internal/presentation/controllers"
	"selector.dev/pulse/internal/presentation/websocket"
)

var PulsePresentationModule = fx.Module(
	"PulsePresentationModule",
	fx.Provide(controllers.NewUserController),
	fx.Provide(controllers.NewPayersController),
	fx.Provide(controllers.NewProductionsController),
	fx.Provide(controllers.NewExpensesController),
	fx.Provide(controllers.NewBookingController),
	fx.Provide(controllers.NewWorkerController),
	fx.Provide(controllers.NewBookingStatsController),
	fx.Provide(controllers.NewInvoicesController),
	fx.Provide(controllers.NewBillsController),
	fx.Provide(controllers.NewReceivableStatsController),
	fx.Provide(controllers.NewPayableStatsController),
	fx.Provide(controllers.NewActivityLogController),
	fx.Provide(controllers.NewProductionStatsController),
	fx.Provide(controllers.NewOverviewStatsController),
	fx.Provide(controllers.NewAdvertisersController),
	fx.Provide(websocket.ProvideWebSocketManager),
	fx.Invoke(SetupUserRoutes),
	fx.Invoke(SetupPayerRoutes),
	fx.Invoke(SetupProductionRoutes),
	fx.Invoke(SetupHealthRoutes),
	fx.Invoke(SetupDocsRoutes),
	fx.Invoke(SetupExpensesRoutes),
	fx.Invoke(SetupStaticRoutes),
	fx.Invoke(SetupBookingRoutes),
	fx.Invoke(SetupWorkerRoutes),
	fx.Invoke(SetupBookingStatsRoutes),
	fx.Invoke(SetupInvoicesRoutes),
	fx.Invoke(SetupBillsRoutes),
	fx.Invoke(SetupWsRoutes),
	fx.Invoke(SetupReceivablesRoutes),
	fx.Invoke(SetupPayablesRoutes),
	fx.Invoke(SetupActivityLogRoutes),
	fx.Invoke(SetupProductionDetailsRoutes),
	fx.Invoke(SetupOverviewRoutes),
	fx.Invoke(SetupAdvertisersRoutes),
	fx.Invoke(startWebsocket),
)

func startWebsocket(lc fx.Lifecycle, ws services.INotification) {
	lc.Append(fx.Hook{
		OnStart: func(ctx context.Context) error {
			go ws.Run()
			return nil
		},
		OnStop: func(ctx context.Context) error {
			return nil
		},
	})
}
