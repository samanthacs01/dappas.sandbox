package controllers

import (
	"errors"

	"selector.dev/pulse/internal/application/dtos"
	"selector.dev/pulse/internal/application/services"
	"selector.dev/pulse/internal/domain/receivables"
	"selector.dev/webapi"
)

type IReceivableStatsController interface {
	GetKpiByDateRange(input *dtos.RangeDateInput) (*webapi.Result[receivables.ReceivableStats], *webapi.Failure)
	GetTotalOutstandingValues(input *dtos.RangeDateInput) (*webapi.Result[[]receivables.ReceivableKpiDetailsItem], *webapi.Failure)
	GetTotalOverdueValues(input *dtos.RangeDateInput) (*webapi.Result[[]map[string]interface{}], *webapi.Failure)
	GetCollectionOverAllValues(input *dtos.RangeDateInput) (*webapi.Result[[]receivables.ReceivableKpiDetailsItem], *webapi.Failure)
	GetCollectionWithPaymentTermsValues(input *dtos.RangeDateInput) (*webapi.Result[[]receivables.ReceivableKpiDetailsItem], *webapi.Failure)
	GetCustomerConcentrationValues(input *dtos.RangeDateInput) (*webapi.Result[[]receivables.ReceivableKpiDetailsItem], *webapi.Failure)
}

type receivableStatsController struct {
	s services.IInvoicesService
}

func NewReceivableStatsController(s services.IInvoicesService) IReceivableStatsController {
	return &receivableStatsController{
		s: s,
	}
}

// GetKpiByDateRange godoc
// @Summary Get KPI by date range
// @Description Get KPI by date range
// @Tags receivables/overview
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param from query string true "From: yyyy-mm-dd"
// @Param to query string true "To: yyyy-mm-dd"
// @Success 200 {object} receivables.ReceivableStats
// @failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /receivables/overview/stats [get]
func (c *receivableStatsController) GetKpiByDateRange(input *dtos.RangeDateInput) (*webapi.Result[receivables.ReceivableStats], *webapi.Failure) {
	kpi, err := c.s.GetKpiByDateRange(input.From, input.To)
	if err != nil {
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	result := webapi.Ok(*kpi)
	return &result, nil
}

// GetCollectionRateValues godoc
// @Summary Get collection rate values
// @Description Get collection rate values
// @Tags receivables/overview
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param from query string true "From: yyyy-mm-dd"
// @Param to query string true "To: yyyy-mm-dd"
// @Success 200 {object} []receivables.ReceivableKpiDetailsItem
// @failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /receivables/overview/collection_over_all [get]
func (c *receivableStatsController) GetCollectionOverAllValues(input *dtos.RangeDateInput) (*webapi.Result[[]receivables.ReceivableKpiDetailsItem], *webapi.Failure) {
	values, err := c.s.GetCollectionRateValues(input.From, input.To)
	if err != nil {
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	if values == nil || len(*values) == 0 {
		fail := webapi.NotFound(errors.New("no values found"))
		return nil, &fail
	}
	result := webapi.Ok(*values)
	return &result, nil
}

// GetCollectionWithPaymentTermsValues godoc
// @Summary Get collection with payment terms values
// @Description Get collection with payment terms values
// @Tags receivables/overview
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param from query string true "From: yyyy-mm-dd"
// @Param to query string true "To: yyyy-mm-dd"
// @Success 200 {object} []receivables.ReceivableKpiDetailsItem
// @failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /receivables/overview/collection_with_payment_terms [get]
func (c *receivableStatsController) GetCollectionWithPaymentTermsValues(input *dtos.RangeDateInput) (*webapi.Result[[]receivables.ReceivableKpiDetailsItem], *webapi.Failure) {
	values, err := c.s.GetCollectionWithPaymentTermsValues(input.From, input.To)
	if err != nil {
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	if values == nil || len(*values) == 0 {
		fail := webapi.NotFound(errors.New("no values found"))
		return nil, &fail
	}
	result := webapi.Ok(*values)
	return &result, nil
}

// GetCustomerConcentrationValues godoc
// @Summary Get customer concentration values
// @Description Get customer concentration values
// @Tags receivables/overview
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param from query string true "From: yyyy-mm-dd"
// @Param to query string true "To: yyyy-mm-dd"
// @Success 200 {object} []receivables.ReceivableKpiDetailsItem
// @failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /receivables/overview/customer_concentration [get]
func (c *receivableStatsController) GetCustomerConcentrationValues(input *dtos.RangeDateInput) (*webapi.Result[[]receivables.ReceivableKpiDetailsItem], *webapi.Failure) {
	values, err := c.s.GetCustomerConcentrationValues(input.From, input.To)
	if err != nil {
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	if values == nil || len(*values) == 0 {
		fail := webapi.NotFound(errors.New("no values found"))
		return nil, &fail
	}
	result := webapi.Ok(*values)
	return &result, nil
}

// GetTotalOutstandingValues godoc
// @Summary Get total outstanding values
// @Description Get total outstanding values
// @Tags receivables/overview
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param from query string true "From: yyyy-mm-dd"
// @Param to query string true "To: yyyy-mm-dd"
// @Success 200 {object} []receivables.ReceivableKpiDetailsItem
// @failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /receivables/overview/outstanding [get]
func (c *receivableStatsController) GetTotalOutstandingValues(input *dtos.RangeDateInput) (*webapi.Result[[]receivables.ReceivableKpiDetailsItem], *webapi.Failure) {
	values, err := c.s.GetTotalOutstandingValues(input.From, input.To)
	if err != nil {
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	if values == nil || len(*values) == 0 {
		fail := webapi.NotFound(errors.New("no values found"))
		return nil, &fail
	}
	result := webapi.Ok(*values)
	return &result, nil
}

// GetTotalOverdueValues godoc
// @Summary Get total overdue values
// @Description Get total overdue values
// @Tags receivables/overview
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param from query string true "From: yyyy-mm-dd"
// @Param to query string true "To: yyyy-mm-dd"
// @Success 200 {object} []map[string]interface{}
// @failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /receivables/overview/overdue [get]
func (c *receivableStatsController) GetTotalOverdueValues(input *dtos.RangeDateInput) (*webapi.Result[[]map[string]interface{}], *webapi.Failure) {
	values, err := c.s.GetTotalOverdueValues(input.From, input.To)
	if err != nil {
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	if values == nil || len(*values) == 0 {
		fail := webapi.NotFound(errors.New("no values found"))
		return nil, &fail
	}
	result := webapi.Ok(*values)
	return &result, nil
}
