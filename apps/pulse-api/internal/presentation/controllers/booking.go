package controllers

import (
	"errors"

	"go.uber.org/zap"
	"selector.dev/pulse/internal/application/dtos"
	application "selector.dev/pulse/internal/application/services"
	domain "selector.dev/pulse/internal/domain/booking"
	"selector.dev/pulse/internal/domain/shared/services"
	"selector.dev/webapi"
)

type IBookingController interface {
	GetInsertionOrders(input *dtos.InsertionOrderFilterInput) (*webapi.Result[dtos.InsertionOrders], *webapi.Failure)
	GetIoDrafts(input *dtos.IoDraftFilterInput) (*webapi.Result[dtos.IoDrafts], *webapi.Failure)
	GetIoDraftsAmountPendingToReview() (*webapi.Result[dtos.IoDraftsAmountPendingToReview], *webapi.Failure)
	GetFlights(input *dtos.FlightFilterInput) (*webapi.Result[dtos.Flights], *webapi.Failure)
	GetFileProcessingStatus() (*webapi.Result[domain.ProcessingStatus], *webapi.Failure)
	UploadOrders(input *dtos.UploadOrdersInput) (*webapi.Result[interface{}], *webapi.Failure)
	GetDraftById(input *dtos.DraftByIdInput) (*webapi.Result[domain.IoDraftDetails], *webapi.Failure)
	ReviewedDraft(input *domain.ReviewedDraftInput) (*webapi.Result[interface{}], *webapi.Failure)
	DeleteDraft(input *dtos.DeleteDraftInput) (*webapi.Result[interface{}], *webapi.Failure)
}

type bookingController struct {
	logger  *zap.Logger
	service application.IBookingService
	notify  services.INotification
}

func NewBookingController(l *zap.Logger, s application.IBookingService, notify services.INotification) IBookingController {
	return &bookingController{
		logger:  l,
		service: s,
		notify:  notify,
	}
}

// GetInsertionOrders godoc
// @Summary Get insertion orders
// @Description Get insertion orders
// @Tags bookings
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param page query int false "Page"
// @Param page_size query int false "Page size"
// @Param q query string false "Search"
// @Param productions query []int false "Productions"
// @Param status query []string false "Status"
// @Param payers query []int false "Payers"
// @Param sort query []string false "Sort"
// @Param from query string false "From"
// @Param to query string false "To"
// @Success 200 {object} InsertionOrders
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /booking/insertion_orders [get]
func (c *bookingController) GetInsertionOrders(input *dtos.InsertionOrderFilterInput) (*webapi.Result[dtos.InsertionOrders], *webapi.Failure) {
	c.logger.Info("GetInsertionOrders", zap.Any("input", input))
	list, err := c.service.GetInsertionOrders(input)
	if err != nil {
		failure := webapi.InternalServerError(err)
		return nil, &failure
	}
	result := webapi.Ok(*list)
	return &result, nil
}

// GetFlights godoc
// @Summary Get flights
// @Description Get flights
// @Tags bookings
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param page query int false "Page by default 1"
// @Param page_size query int false "Page size by default 15"
// @Param status query []string false "Status"
// @Param productions query []int false "Productions"
// @Param payers query []int false "Payers"
// @Param advertisers query []string false "Advertisers"
// @Param from query string false "From"
// @Param to query string false "To"
// @Param sort query []string false "Sort"
// @Success 200 {object} Flights
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /booking/flights [get]
func (c *bookingController) GetFlights(input *dtos.FlightFilterInput) (*webapi.Result[dtos.Flights], *webapi.Failure) {
	c.logger.Info("GetFlights")
	list, err := c.service.GetFlights(input)
	if err != nil {
		failure := webapi.InternalServerError(err)
		return nil, &failure
	}
	result := webapi.Ok(*list)
	return &result, nil
}

// GetIoDrafts godoc
// @Summary Get insertion order drafts
// @Description Get insertion order drafts
// @Tags bookings
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param page query int false "Page"
// @Param page_size query int false "Page size"
// @Param status query []string false "Status"
// @Param sort query []string false "Sort"
// @Success 200 {object} IoDrafts
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /booking/drafts [get]
func (c *bookingController) GetIoDrafts(input *dtos.IoDraftFilterInput) (*webapi.Result[dtos.IoDrafts], *webapi.Failure) {
	c.logger.Info("GetIoDrafts")
	list, err := c.service.GetIoDrafts(input)
	if err != nil {
		c.logger.Error("GetIoDrafts error", zap.Error(err))
		failure := webapi.InternalServerError(err)
		return nil, &failure
	}
	result := webapi.Ok(*list)
	return &result, nil
}

// GetFileProcessingStatus godoc
// @Summary Get file processing status
// @Description Get file processing status
// @Tags bookings
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Success 200 {object} ProcessingStatus
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /booking/files_processing_status [get]
func (c *bookingController) GetFileProcessingStatus() (*webapi.Result[domain.ProcessingStatus], *webapi.Failure) {
	c.logger.Info("GetFileProcessingStatus")
	data, err := c.service.GetFileProcessingStatus()
	if err != nil {
		c.logger.Error("GetIoDrafts error", zap.Error(err))
		failure := webapi.InternalServerError(err)
		return nil, &failure
	}
	result := webapi.Ok(*data)
	return &result, nil
}

// UploadOrder godoc
// @Summary Upload order files
// @Description Upload order files
// @Tags bookings
// @Accept multipart/form-data
// @Produce json
// @Security BearerAuth
// @Param files formData []file true "Orders PDFs"
// @Success 204 "it is ok"
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /booking/orders [POST]
func (c *bookingController) UploadOrders(input *dtos.UploadOrdersInput) (*webapi.Result[interface{}], *webapi.Failure) {
	c.logger.Info("UploadOrders")
	err := c.service.UploadOrders(input)
	go c.notify.SendBookingStatus("Document uploaded", err != nil)
	if err != nil {
		c.logger.Error("UploadOrders error", zap.Error(err))
		if errors.Is(err, domain.ErrOrderPDFsAreRequired) || errors.Is(err, domain.ErrInvalidFileType) {
			failure := webapi.BadRequest(err)
			return nil, &failure
		}
		failure := webapi.InternalServerError(err)
		return nil, &failure
	}

	result := webapi.NoContent()

	return &result, nil
}

// GetDraftById godoc
// @Summary Get insertion order draft by id
// @Description Get insertion order draft by id
// @Tags bookings
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param id path int true "Draft ID"
// @Success 200 {object} IoDraftDetails
// @Failure 401 {object} ProblemDetails
// @Failure 404 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /booking/drafts/{id} [get]
func (c *bookingController) GetDraftById(input *dtos.DraftByIdInput) (*webapi.Result[domain.IoDraftDetails], *webapi.Failure) {
	c.logger.Info("GetDraftById")
	if err := input.Validate(); err != nil {
		failure := webapi.NotFound(err)
		return nil, &failure
	}
	data, err := c.service.GetDraftById(input.Id)
	if err != nil {
		c.logger.Error("GetDraftById error", zap.Error(err))
		if errors.Is(err, domain.ErrDraftNotFound) {
			failure := webapi.NotFound(err)
			return nil, &failure
		}
		failure := webapi.InternalServerError(err)
		return nil, &failure
	}
	result := webapi.Ok(*data)
	return &result, nil
}

// ReviewedDraft godoc
// @Summary Reviewed and create insertion order
// @Description Reviewed and create insertion order
// @Tags bookings
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "Draft ID"
// @Param input body domain.ReviewedDraftInput true "Reviewed and create insertion order"
// @Success 204 "it is ok"
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /booking/drafts/{id}/review [post]
func (c *bookingController) ReviewedDraft(input *domain.ReviewedDraftInput) (*webapi.Result[interface{}], *webapi.Failure) {
	c.logger.Info("ReviewedDraft")
	if err := input.Validate(); err != nil {
		failure := webapi.BadRequest(err)
		return nil, &failure
	}
	err := c.service.ReviewedDraft(input)
	go c.notify.SendBookingStatus("Draft reviewed", err != nil)
	if err != nil {
		c.logger.Error("ReviewedDraft error", zap.Error(err))
		failure := webapi.InternalServerError(err)
		return nil, &failure
	}
	result := webapi.NoContent()
	return &result, nil
}

// DeleteDraft godoc
// @Summary Delete insertion order draft
// @Description Delete insertion order draft
// @Tags bookings
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param id path int true "Draft ID"
// @Success 204 "it is ok"
// @Failure 404 {object} ProblemDetails
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /booking/drafts/{id} [delete]
func (c *bookingController) DeleteDraft(input *dtos.DeleteDraftInput) (*webapi.Result[interface{}], *webapi.Failure) {
	c.logger.Info("DeleteDraft")

	if err := c.service.DeleteDraft(input.ID); err != nil {
		c.logger.Error("DeleteDraft error", zap.Error(err))
		if errors.Is(err, domain.ErrDraftNotFound) {
			notFound := webapi.NotFound(err)
			return nil, &notFound
		} else if errors.Is(err, domain.ErrDraftCannotBeDeleted) {
			badRequest := webapi.BadRequest(err)
			return nil, &badRequest
		}
		failure := webapi.InternalServerError(err)
		return nil, &failure
	}
	result := webapi.NoContent()
	return &result, nil
}

// GetIoDraftsAmountPendingToReview godoc
// @Summary Get amount of insertion order drafts pending to review
// @Description Get amount of insertion order drafts pending to review
// @Tags bookings
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Success 200 {object} dtos.IoDraftsAmountPendingToReview
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /booking/drafts_pending [get]
func (c *bookingController) GetIoDraftsAmountPendingToReview() (*webapi.Result[dtos.IoDraftsAmountPendingToReview], *webapi.Failure) {
	c.logger.Info("GetIoDraftsAmountPendingToReview")
	data, err := c.service.GetIoDraftsAmountPendingToReview()
	if err != nil {
		c.logger.Error("GetIoDraftsAmountPendingToReview error", zap.Error(err))
		failure := webapi.InternalServerError(err)
		return nil, &failure
	}
	result := webapi.Ok(*data)
	return &result, nil
}
