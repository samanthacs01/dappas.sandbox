package controllers

import (
	"selector.dev/pulse/internal/application/dtos"
	"selector.dev/pulse/internal/application/services"
	"selector.dev/pulse/internal/domain/booking"
	"selector.dev/webapi"
)

type IBookingStatsController interface {
	GetKpiByDateRange(input *dtos.RangeDateInput) (*webapi.Result[booking.BookingStats], *webapi.Failure)
	GetValues(input *dtos.RangeDateInput) (*webapi.Result[[]booking.BookingKpiDetailsItem], *webapi.Failure)
	GetFulfillmentRates(input *dtos.RangeDateInput) (*webapi.Result[[]booking.BookingKpiDetailsItem], *webapi.Failure)
	GetPayersConcentration(input *dtos.RangeDateInput) (*webapi.Result[[]booking.BookingKpiDetailsItem], *webapi.Failure)
	GetProductionsConcentration(input *dtos.RangeDateInput) (*webapi.Result[[]booking.BookingKpiDetailsItem], *webapi.Failure)
}

type bookingStatsController struct {
	s services.IBookingStatsServices
}

func NewBookingStatsController(s services.IBookingStatsServices) IBookingStatsController {
	return &bookingStatsController{
		s: s,
	}
}

// GetKpiByDateRange godoc
// @Summary Get KPI by date range
// @Description Get KPI by date range
// @Tags bookings
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param from query string true "From: yyyy-mm-dd"
// @Param to query string true "To: yyyy-mm-dd"
// @Success 200 {object} booking.BookingStats
// @failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /booking/stats [get]
func (c *bookingStatsController) GetKpiByDateRange(input *dtos.RangeDateInput) (*webapi.Result[booking.BookingStats], *webapi.Failure) {
	kpi, err := c.s.GetKpiByDateRange(input.From, input.To)
	if err != nil {
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	result := webapi.Ok(*kpi)
	return &result, nil
}

// GetValues godoc
// @Summary Get booking value details
// @Description Get booking value details
// @Tags bookings
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param from query string true "From: yyyy-mm-dd"
// @Param to query string true "To: yyyy-mm-dd"
// @Success 200 {object} []booking.BookingKpiDetailsItem
// @failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /booking/stats/booking_value [get]
func (c *bookingStatsController) GetValues(input *dtos.RangeDateInput) (*webapi.Result[[]booking.BookingKpiDetailsItem], *webapi.Failure) {
	kpi, err := c.s.GetBookingValueDetails(input)
	if err != nil {
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	result := webapi.Ok(*kpi)
	return &result, nil
}

// GetFulfillmentRates godoc
// @Summary Get fulfillment rate details
// @Description Get fulfillment rate details
// @Tags bookings
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param from query string true "From: yyyy-mm-dd"
// @Param to query string true "To: yyyy-mm-dd"
// @Success 200 {object} []booking.BookingKpiDetailsItem
// @failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /booking/stats/fulfillment_rate [get]
func (c *bookingStatsController) GetFulfillmentRates(input *dtos.RangeDateInput) (*webapi.Result[[]booking.BookingKpiDetailsItem], *webapi.Failure) {
	kpi, err := c.s.GetBookingFulfillmentRateDetails(input)
	if err != nil {
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	result := webapi.Ok(*kpi)
	return &result, nil
}

// GetBookingPayersConcentrationDetails godoc
// @Summary Get payer concentration details
// @Description Get payer concentration details
// @Tags bookings
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param from query string true "From: yyyy-mm-dd"
// @Param to query string true "To: yyyy-mm-dd"
// @Success 200 {object} []booking.BookingKpiDetailsItem
// @failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /booking/stats/payers_concentration [get]
func (c *bookingStatsController) GetPayersConcentration(input *dtos.RangeDateInput) (*webapi.Result[[]booking.BookingKpiDetailsItem], *webapi.Failure) {
	kpi, err := c.s.GetBookingPayersConcentrationDetails(input)
	if err != nil {
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	result := webapi.Ok(*kpi)
	return &result, nil
}

// GetBookingProductionsConcentrationDetails godoc
// @Summary Get productions concentration details
// @Description Get productions concentration details
// @Tags bookings
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param from query string true "From: yyyy-mm-dd"
// @Param to query string true "To: yyyy-mm-dd"
// @Success 200 {object} []booking.BookingKpiDetailsItem
// @failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /booking/stats/productions_concentration [get]
func (c *bookingStatsController) GetProductionsConcentration(input *dtos.RangeDateInput) (*webapi.Result[[]booking.BookingKpiDetailsItem], *webapi.Failure) {
	kpi, err := c.s.GetBookingProductionsConcentrationDetails(input)
	if err != nil {
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	result := webapi.Ok(*kpi)
	return &result, nil
}
