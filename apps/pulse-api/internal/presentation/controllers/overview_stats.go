package controllers

import (
	"selector.dev/pulse/internal/application/dtos"
	"selector.dev/pulse/internal/domain/overview"
	"selector.dev/webapi"
)

type IOverviewStatsController interface {
	GetKpiByDateRange(input *dtos.RangeDateInput) (*webapi.Result[overview.OverviewStats], *webapi.Failure)
	GetKpiDetailsByTotalRevenueAndDateRange(input *dtos.RangeDateInput) (*webapi.Result[[]overview.OverviewKpiDetailsItem], *webapi.Failure)
	GetKpiStackDetailsByTypeAndDateRange(input *dtos.RangeDateInput) (*webapi.Result[[]map[string]interface{}], *webapi.Failure)
	GetKpiDetailsByDsoAndDateRange(input *dtos.RangeDateInput) (*webapi.Result[[]overview.OverviewKpiDetailsItemWithComposeValue], *webapi.Failure)
	GetKpiDetailsByDpoAndDateRange(input *dtos.RangeDateInput) (*webapi.Result[[]overview.OverviewKpiDetailsItemWithComposeValue], *webapi.Failure)
}

type overviewStatsController struct {
	repository overview.IOverviewRepository
}

func NewOverviewStatsController(r overview.IOverviewRepository) IOverviewStatsController {
	return &overviewStatsController{
		repository: r,
	}
}

// GetKpiByDateRange godoc
// @Summary Get KPI overview by date range
// @Description Get KPI overview by date range
// @Tags overview
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param from query string true "From: yyyy-mm-dd"
// @Param to query string true "To: yyyy-mm-dd"
// @Success 200 {object} overview.OverviewStats
// @failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /overview/stats [get]
func (c *overviewStatsController) GetKpiByDateRange(input *dtos.RangeDateInput) (*webapi.Result[overview.OverviewStats], *webapi.Failure) {
	kpi, err := c.repository.GetOverviewStatsKpi(input.From, input.To)
	if err != nil {
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	result := webapi.Ok(*kpi)
	return &result, nil
}

// GetKpiDetailsByTypeAndDateRange  godoc
// @Summary Get KPI overview details by type and date range
// @Description Get KPI overview details by type and date range
// @Tags overview
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param from query string true "From: yyyy-mm-dd"
// @Param to query string true "To: yyyy-mm-dd"
// @Success 200 {object} []overview.OverviewKpiDetailsItem
// @failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /overview/stats/overview_total_revenue [get]
func (c *overviewStatsController) GetKpiDetailsByTotalRevenueAndDateRange(input *dtos.RangeDateInput) (*webapi.Result[[]overview.OverviewKpiDetailsItem], *webapi.Failure) {
	kpi, err := c.repository.GetOverviewStatsKpiDetails("overview_total_revenue", input.From, input.To)
	if err != nil {
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	result := webapi.Ok(kpi)
	return &result, nil
}

// GetKpiDetailsByTypeAndDateRange  godoc
// @Summary Get KPI overview details by type and date range
// @Description Get KPI overview details by type and date range
// @Tags overview
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param from query string true "From: yyyy-mm-dd"
// @Param to query string true "To: yyyy-mm-dd"
// @Success 200 {object} []overview.OverviewKpiDetailsItemWithComposeValue
// @failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /overview/stats/dso [get]
func (c *overviewStatsController) GetKpiDetailsByDsoAndDateRange(input *dtos.RangeDateInput) (*webapi.Result[[]overview.OverviewKpiDetailsItemWithComposeValue], *webapi.Failure) {
	kpi, err := c.repository.GetOverviewStatsKpiDetailsWithCompose("dso", input.From, input.To)
	if err != nil {
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	result := webapi.Ok(kpi)
	return &result, nil
}

// GetKpiDetailsByTypeAndDateRange  godoc
// @Summary Get KPI overview details by type and date range
// @Description Get KPI overview details by type and date range
// @Tags overview
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param from query string true "From: yyyy-mm-dd"
// @Param to query string true "To: yyyy-mm-dd"
// @Success 200 {object} []overview.OverviewKpiDetailsItemWithComposeValue
// @failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /overview/stats/dpo [get]
func (c *overviewStatsController) GetKpiDetailsByDpoAndDateRange(input *dtos.RangeDateInput) (*webapi.Result[[]overview.OverviewKpiDetailsItemWithComposeValue], *webapi.Failure) {
	kpi, err := c.repository.GetOverviewStatsKpiDetailsWithCompose("dpo", input.From, input.To)
	if err != nil {
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	result := webapi.Ok(kpi)
	return &result, nil
}

// GetKpiDetailsByTypeAndDateRange  godoc
// @Summary Get KPI overview details by type and date range
// @Description Get KPI overview details by type and date range
// @Tags overview
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param from query string true "From: yyyy-mm-dd"
// @Param to query string true "To: yyyy-mm-dd"
// @Success 200 {object} []map[string]interface{}
// @failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /overview/stats/gross_margin [get]
func (c *overviewStatsController) GetKpiStackDetailsByTypeAndDateRange(input *dtos.RangeDateInput) (*webapi.Result[[]map[string]interface{}], *webapi.Failure) {
	kpi, err := c.repository.GetOverviewStackStatsKpiDetails("gross_margin", input.From, input.To)
	if err != nil {
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	result := webapi.Ok(kpi)
	return &result, nil
}
