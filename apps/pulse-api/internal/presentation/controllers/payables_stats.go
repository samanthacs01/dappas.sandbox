package controllers

import (
	"selector.dev/pulse/internal/application/dtos"
	"selector.dev/pulse/internal/domain/payables"
	"selector.dev/webapi"
)

type IPayableStatsController interface {
	GetKpiByDateRange(input *dtos.RangeDateInput) (*webapi.Result[payables.PayableStats], *webapi.Failure)
	GetKpiDetailsByTypeAndDateRange(input *dtos.DetailRangeDateInput) (*webapi.Result[[]payables.PayablesKpiDetailsItem], *webapi.Failure)
	GetKpiStackDetailsByTypeAndDateRange(input *dtos.DetailRangeDateInput) (*webapi.Result[[]map[string]interface{}], *webapi.Failure)
}

type payableStatsController struct {
	repository payables.IBillsRepository
}

func NewPayableStatsController(r payables.IBillsRepository) IPayableStatsController {
	return &payableStatsController{
		repository: r,
	}
}

// GetKpiByDateRange godoc
// @Summary Get KPI by date range
// @Description Get KPI by date range
// @Tags payables/overview
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param from query string true "From: yyyy-mm-dd"
// @Param to query string true "To: yyyy-mm-dd"
// @Success 200 {object} payables.PayableStats
// @failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /payables/overview/stats [get]
func (c *payableStatsController) GetKpiByDateRange(input *dtos.RangeDateInput) (*webapi.Result[payables.PayableStats], *webapi.Failure) {
	kpi, err := c.repository.GetPayablesStatsKpi(input.From, input.To)
	if err != nil {
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	result := webapi.Ok(*kpi)
	return &result, nil
}

// GetKpiDetailsByTypeAndDateRange  godoc
// @Summary Get KPI details by type and date range
// @Description Get KPI details by type and date range
// @Tags payables/overview
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param from query string true "From: yyyy-mm-dd"
// @Param to query string true "To: yyyy-mm-dd"
// @Param type path string true "Type: payables_outstanding_productions, payables_outstanding_dates, paid_uncollected_payment_productions, paid_uncollected_payment_dates"
// @Success 200 {object} []payables.PayablesKpiDetailsItem
// @failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /payables/overview/{type} [get]
func (c *payableStatsController) GetKpiDetailsByTypeAndDateRange(input *dtos.DetailRangeDateInput) (*webapi.Result[[]payables.PayablesKpiDetailsItem], *webapi.Failure) {
	kpi, err := c.repository.GetPayablesStatsKpiDetails(input.Type, input.From, input.To)
	if err != nil {
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	result := webapi.Ok(kpi)
	return &result, nil
}

// GetKpiDetailsByTypeAndDateRange  godoc
// @Summary Get KPI details by type and date range
// @Description Get KPI details by type and date range
// @Tags payables/overview
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param from query string true "From: yyyy-mm-dd"
// @Param to query string true "To: yyyy-mm-dd"
// @Param type path string true "Type: payables_on_time_rate, payables_overdue_bills"
// @Success 200 {object} []map[string]interface{}
// @failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /payables/overview/stack/{type} [get]
func (c *payableStatsController) GetKpiStackDetailsByTypeAndDateRange(input *dtos.DetailRangeDateInput) (*webapi.Result[[]map[string]interface{}], *webapi.Failure) {
	kpi, err := c.repository.GetPayablesStackStatsKpiDetails(input.Type, input.From, input.To)
	if err != nil {
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	result := webapi.Ok(kpi)
	return &result, nil
}
