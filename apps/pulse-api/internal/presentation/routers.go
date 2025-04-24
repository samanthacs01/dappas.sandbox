package presentation

import (
	"net/http"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"selector.dev/pulse/config"
	"selector.dev/pulse/internal/domain/shared"
	"selector.dev/pulse/internal/domain/shared/services"
	"selector.dev/pulse/internal/presentation/controllers"
	"selector.dev/webapi"
)

func SetupUserRoutes(router *gin.Engine, c controllers.UsersController, cfg config.Config, s services.ISessionServices) {
	router.POST("/security/auth", webapi.GinHandler(c.Auth))
	router.DELETE("/security/logout", webapi.Authorize(cfg.GetSecretKey(), s.VerifyToken), webapi.GinHandler(c.Logout))
	router.POST("/users/change_password", webapi.GinHandler(c.ChangePasswordUser))
	router.POST("/users/recovery", webapi.GinHandler(c.RecoveryPassword))
	router.GET("/users", webapi.GinHandler(c.GetUsers))
	router.GET("/users/:id", webapi.GinHandler(c.GetUserById))
	router.POST("/users", webapi.GinHandler(c.CreateUser))
	router.PATCH("/users/:id", webapi.GinHandler(c.UpdateUser))
	router.DELETE("/users/:id", webapi.GinHandler(c.DeleteUser))
	router.POST("/users/:id/resend_email", webapi.GinHandler(c.ResendEmail))
}

func SetupPayerRoutes(router *gin.Engine, cfg config.Config, c controllers.PayersController, s services.ISessionServices) {
	authorizer := webapi.Authorize(cfg.GetSecretKey(), s.VerifyToken)
	authorizerAdmin := webapi.Authorize(cfg.GetSecretKey(), s.VerifyToken, string(shared.RoleAdmin))
	router.GET("/filters/payers", authorizer, webapi.GinHandlerParamsLess(c.GetPayersAsNomenclator))
	router.GET("/payers/:id", authorizer, webapi.GinHandler(c.GetPayerById))
	router.GET("/payers", authorizer, webapi.GinHandler(c.GetPayers))
	router.POST("/payers", authorizerAdmin, webapi.GinHandler(c.CreatePayer))
	router.DELETE("/payers/:id", authorizerAdmin, webapi.GinHandler(c.DeletePayer))
	router.PATCH("/payers/:id", authorizerAdmin, webapi.GinHandler(c.UpdatePayer))
}

func SetupProductionRoutes(router *gin.Engine, cfg config.Config, c controllers.ProductionsController, s services.ISessionServices) {
	authorizerAdmin := webapi.Authorize(cfg.GetSecretKey(), s.VerifyToken, string(shared.RoleAdmin))
	router.GET("/filters/productions", webapi.Authorize(cfg.GetSecretKey(), s.VerifyToken), webapi.GinHandlerParamsLess(c.GetProductionsAsNomenclator))
	router.GET("/productions", webapi.Authorize(cfg.GetSecretKey(), s.VerifyToken), webapi.GinHandler(c.GetProductions))
	router.POST("/productions", authorizerAdmin, webapi.GinHandler(c.CreateProduction))
	router.GET("/productions/:id", webapi.Authorize(cfg.GetSecretKey(), s.VerifyToken), webapi.GinHandler(c.GetProductionByID))
	router.DELETE("/productions/:id", authorizerAdmin, webapi.GinHandler(c.DeleteProduction))
	router.PATCH("/productions/:id", authorizerAdmin, webapi.GinHandler(c.UpdateProduction))

}

func SetupDocsRoutes(router *gin.Engine, c services.ISessionServices) {
	router.GET("/swagger/*any", basicAuth(c), ginSwagger.WrapHandler(swaggerFiles.Handler, func(c *ginSwagger.Config) {
		c.PersistAuthorization = true
	}))
}

func SetupAdvertisersRoutes(router *gin.Engine, cfg config.Config, c controllers.IAdvertisersController, s services.ISessionServices) {
	authorizer := webapi.Authorize(cfg.GetSecretKey(), s.VerifyToken)
	router.GET("/filters/advertisers", authorizer, webapi.GinHandlerParamsLess(c.GetItemsAsNomenclator))
}

func SetupExpensesRoutes(router *gin.Engine, cfg config.Config, c controllers.ExpensesController, s services.ISessionServices) {
	authorizer := webapi.Authorize(cfg.GetSecretKey(), s.VerifyToken)
	authorizerAdmin := webapi.Authorize(cfg.GetSecretKey(), s.VerifyToken, string(shared.RoleAdmin))
	router.GET("/expenses", authorizer, webapi.GinHandler(c.GetExpenses))
	router.POST("/expenses", authorizer, authorizerAdmin, webapi.GinHandler(c.CreateExpense))
	router.DELETE("/expenses/:id", authorizer, authorizerAdmin, webapi.GinHandler(c.DeleteExpense))
	router.GET("/expenses/:id", authorizer, webapi.GinHandler(c.GetExpense))
	router.PATCH("/expenses/:id", authorizer, webapi.GinHandler(c.PatchExpense))
	router.GET("/productions/expenses/collection", authorizer, webapi.GinHandler(c.GetExpensesByProductionCollection))
}

func SetupBookingRoutes(router *gin.Engine, cfg config.Config, c controllers.IBookingController, s services.ISessionServices) {
	authorizer := webapi.Authorize(cfg.GetSecretKey(), s.VerifyToken)
	authorizerAdmin := webapi.Authorize(cfg.GetSecretKey(), s.VerifyToken, string(shared.RoleAdmin))
	router.GET("/booking/insertion_orders", authorizer, webapi.GinHandler(c.GetInsertionOrders))
	router.GET("/booking/drafts", authorizer, webapi.GinHandler(c.GetIoDrafts))
	router.GET("/booking/flights", authorizer, webapi.GinHandler(c.GetFlights))
	router.GET("/booking/files_processing_status", authorizer, webapi.GinHandlerParamsLess(c.GetFileProcessingStatus))
	router.POST("/booking/orders", authorizerAdmin, webapi.GinHandler(c.UploadOrders))
	router.GET("/booking/drafts/:id", authorizer, webapi.GinHandler(c.GetDraftById))
	router.POST("/booking/drafts/:id/review", authorizer, webapi.GinHandler(c.ReviewedDraft))
	router.DELETE("/booking/drafts/:id", authorizer, webapi.GinHandler(c.DeleteDraft))
	router.GET("/booking/drafts_pending", authorizer, webapi.GinHandlerParamsLess(c.GetIoDraftsAmountPendingToReview))
}
func SetupInvoicesRoutes(router *gin.Engine, cfg config.Config, c controllers.IInvoicesController, s services.ISessionServices) {
	authorizer := webapi.Authorize(cfg.GetSecretKey(), s.VerifyToken)
	authorizerAdmin := webapi.Authorize(cfg.GetSecretKey(), s.VerifyToken, string(shared.RoleAdmin))
	router.POST("/invoices/generate", authorizerAdmin, webapi.GinHandler(c.GenerateBills))
	router.POST("/invoices/accept", authorizerAdmin, webapi.GinHandler(c.AcceptGeneratedBills))
	router.GET("/invoices", authorizer, webapi.GinHandler(c.GetInvoices))
	router.GET("/invoices/export", authorizer, webapi.GinHandlerWithWriter(c.ExportInvoices))
	router.POST("/invoices/:id/payment", authorizer, webapi.GinHandler(c.RegisterPayment))
}
func SetupReceivablesRoutes(router *gin.Engine, cfg config.Config, c controllers.IReceivableStatsController, s services.ISessionServices) {
	authorizer := webapi.Authorize(cfg.GetSecretKey(), s.VerifyToken)
	router.GET("/receivables/overview/stats", authorizer, webapi.GinHandler(c.GetKpiByDateRange))
	router.GET("/receivables/overview/collection_over_all", authorizer, webapi.GinHandler(c.GetCollectionOverAllValues))
	router.GET("/receivables/overview/collection_with_payment_terms", authorizer, webapi.GinHandler(c.GetCollectionWithPaymentTermsValues))
	router.GET("/receivables/overview/customer_concentration", authorizer, webapi.GinHandler(c.GetCustomerConcentrationValues))
	router.GET("/receivables/overview/overdue", authorizer, webapi.GinHandler(c.GetTotalOverdueValues))
	router.GET("/receivables/overview/outstanding", authorizer, webapi.GinHandler(c.GetTotalOutstandingValues))
}
func SetupPayablesRoutes(router *gin.Engine, cfg config.Config, c controllers.IPayableStatsController, s services.ISessionServices) {
	authorizer := webapi.Authorize(cfg.GetSecretKey(), s.VerifyToken)
	router.GET("/payables/overview/stats", authorizer, webapi.GinHandler(c.GetKpiByDateRange))
	router.GET("/payables/overview/stack/:type", authorizer, webapi.GinHandler(c.GetKpiStackDetailsByTypeAndDateRange))
	router.GET("/payables/overview/:type", authorizer, webapi.GinHandler(c.GetKpiDetailsByTypeAndDateRange))
}

func SetupOverviewRoutes(router *gin.Engine, cfg config.Config, c controllers.IOverviewStatsController, s services.ISessionServices) {
	authorizer := webapi.Authorize(cfg.GetSecretKey(), s.VerifyToken)
	router.GET("/overview/stats", authorizer, webapi.GinHandler(c.GetKpiByDateRange))
	router.GET("/overview/stats/gross_margin", authorizer, webapi.GinHandler(c.GetKpiStackDetailsByTypeAndDateRange))
	router.GET("/overview/stats/overview_total_revenue", authorizer, webapi.GinHandler(c.GetKpiDetailsByTotalRevenueAndDateRange))
	router.GET("/overview/stats/dpo", authorizer, webapi.GinHandler(c.GetKpiDetailsByDpoAndDateRange))
	router.GET("/overview/stats/dso", authorizer, webapi.GinHandler(c.GetKpiDetailsByDsoAndDateRange))
}

func SetupProductionDetailsRoutes(router *gin.Engine, cfg config.Config, c controllers.IProductionStatsController, s services.ISessionServices) {
	authorizer := webapi.Authorize(cfg.GetSecretKey(), s.VerifyToken)
	router.GET("/production-details//overview/stats", authorizer, webapi.GinHandler(c.GetProductionStatsKpi))
	router.GET("/production-details/overview/stats/:type", authorizer, webapi.GinHandler(c.GetKpiDetailsByTypeAndDateRange))
}
func SetupActivityLogRoutes(router *gin.Engine, cfg config.Config, c controllers.IActivityLogController, s services.ISessionServices) {
	authorizer := webapi.Authorize(cfg.GetSecretKey(), s.VerifyToken)
	router.GET("/activity_logs", authorizer, webapi.GinHandler(c.FindAll))
}

func SetupBookingStatsRoutes(router *gin.Engine, cfg config.Config, c controllers.IBookingStatsController, s services.ISessionServices) {
	authorizer := webapi.Authorize(cfg.GetSecretKey(), s.VerifyToken)
	router.GET("/booking/stats", authorizer, webapi.GinHandler(c.GetKpiByDateRange))
	router.GET("/booking/stats/booking_value", authorizer, webapi.GinHandler(c.GetValues))
	router.GET("/booking/stats/fulfillment_rate", authorizer, webapi.GinHandler(c.GetFulfillmentRates))
	router.GET("/booking/stats/payers_concentration", authorizer, webapi.GinHandler(c.GetPayersConcentration))
	router.GET("/booking/stats/productions_concentration", authorizer, webapi.GinHandler(c.GetProductionsConcentration))
}

func SetupBillsRoutes(router *gin.Engine, cfg config.Config, c controllers.IBillsController, s services.ISessionServices) {
	authorizer := webapi.Authorize(cfg.GetSecretKey(), s.VerifyToken)
	authorizerAdmin := webapi.Authorize(cfg.GetSecretKey(), s.VerifyToken, string(shared.RoleAdmin))
	router.GET("/payables/bills", authorizer, webapi.GinHandler(c.GetBills))
	router.POST("/payables/bills/:id/payment", authorizer, authorizerAdmin, webapi.GinHandler(c.RegisterPayment))
	router.GET("/payables/bills/billing", authorizer, webapi.GinHandler(c.GetBillsByBillingProductionId))
	router.GET("/payables/bills/collection", authorizer, webapi.GinHandler(c.GetBillsByCollectionProductionId))
}

func SetupHealthRoutes(router *gin.Engine) {
	router.GET("/health", health)
	router.GET("/", health)
}
func SetupStaticRoutes(router *gin.Engine) {
	router.Static("/uploads", "/app/bucket/upload")
}

func SetupWorkerRoutes(router *gin.Engine, c controllers.IWorkerController) {
	router.POST("/worker/process_documents", webapi.GinHandlerParamsLess(c.ProcessDocuments))
}

func SetupWsRoutes(router *gin.Engine, ws services.INotification, cfg config.Config, s services.ISessionServices) {
	//authorizer := webapi.Authorize(cfg.GetSecretKey(), s.VerifyToken)
	router.GET("/ws", ws.HandleConnections)
}

// @region Internal functions
func health(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Pulse API is running",
	})
}

func basicAuth(s services.ISessionServices) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		email, pass, hasAuth := ctx.Request.BasicAuth()
		_, err := s.Authenticate(email, pass)
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

//@endregion
