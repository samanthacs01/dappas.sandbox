package application

import (
	"go.uber.org/fx"
	"selector.dev/pulse/internal/application/services"
)

var PulseApplicationModule = fx.Module(
	"PulseApplicationModule",
	fx.Provide(services.NewPayerService),
	fx.Provide(services.NewProductionService),
	fx.Provide(services.NewExpensesService),
	fx.Provide(services.NewBookingService),
	fx.Provide(services.NewUserService),
	fx.Provide(services.NewBookingStatsService),
	fx.Provide(services.NewInvoicesService),
	fx.Provide(services.NewBillsService),
	fx.Provide(services.NewActivityLogService),
)
