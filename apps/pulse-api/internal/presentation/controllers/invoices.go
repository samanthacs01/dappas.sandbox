package controllers

import (
	"encoding/csv"
	"errors"
	"fmt"
	"strings"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"selector.dev/pulse/internal/application/dtos"
	"selector.dev/pulse/internal/application/services"
	"selector.dev/pulse/internal/domain/booking"
	"selector.dev/pulse/internal/domain/receivables"
	"selector.dev/webapi"
)

type IInvoicesController interface {
	GenerateBills(input *dtos.GenerateBillsInput) (*webapi.Result[[]receivables.DraftInvoice], *webapi.Failure)
	GetInvoices(input *dtos.ListWithFilterInput) (*webapi.Result[dtos.Invoices], *webapi.Failure)
	AcceptGeneratedBills(input *dtos.AcceptGeneratedBillingInput) (*webapi.Result[interface{}], *webapi.Failure)
	ExportInvoices(input *dtos.ListWithFilterInput, writer gin.ResponseWriter) *webapi.Failure
	RegisterPayment(input *dtos.RegisterPaymentInput) (*webapi.Result[interface{}], *webapi.Failure)
}

func convertPointerSliceToStringSlice(pointerSlice []*string) []string {
	stringSlice := make([]string, len(pointerSlice))
	for i, ptr := range pointerSlice {
		if ptr != nil {
			stringSlice[i] = *ptr
		} else {
			stringSlice[i] = ""
		}
	}
	return stringSlice
}

type invoicesController struct {
	service services.IInvoicesService
	logger  *zap.Logger
}

func NewInvoicesController(service services.IInvoicesService, logger *zap.Logger) IInvoicesController {
	return &invoicesController{
		service: service,
		logger:  logger,
	}
}

// GenerateBills godoc
// @Summary Generate bills
// @Description Generate bills
// @Tags invoices
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param input body dtos.GenerateBillsInput true "Generate bills"
// @Success 200 {object} []receivables.DraftInvoice
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /invoices/generate [post]
func (c *invoicesController) GenerateBills(input *dtos.GenerateBillsInput) (*webapi.Result[[]receivables.DraftInvoice], *webapi.Failure) {
	c.logger.Info("GenerateBills")
	if err := input.Validate(); err != nil {
		failure := webapi.BadRequest(err)
		return nil, &failure
	}
	invoices, err := c.service.GenerateBills(input)
	if err != nil {
		c.logger.Error("GenerateBills error", zap.Error(err))
		if errors.Is(err, booking.ErrFlightsAlreadyInvoiced) {
			failure := webapi.BadRequest(err)
			return nil, &failure
		}
		failure := webapi.InternalServerError(err)
		return nil, &failure
	}
	result := webapi.Ok(*invoices)
	return &result, nil
}

// GetInvoices godoc
// @Summary Get invoices
// @Description Get invoices
// @Tags invoices
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param q query string false "Search"
// @Param productions query []int false "Productions"
// @Param status query []string false "Status"
// @Param payers query []int false "Payers"
// @Param from query string false "From"
// @Param to query string false "To"
// @Param page query int false "Page"
// @Param page_size query int false "Page size"
// @Param sort query []string false "Sort"
// @Success 200 {object} dtos.Invoices
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /invoices [get]
func (c *invoicesController) GetInvoices(input *dtos.ListWithFilterInput) (*webapi.Result[dtos.Invoices], *webapi.Failure) {
	c.logger.Info("GetInvoices")
	invoices, err := c.service.GetInvoices(input)
	if err != nil {
		c.logger.Error("GetInvoices error", zap.Error(err))
		failure := webapi.InternalServerError(err)
		return nil, &failure
	}
	result := webapi.Ok(*invoices)
	return &result, nil
}

// AcceptGeneratedBills docs
// @Summary Approved bills generated
// @Description Approved bills generated
// @Tags invoices
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param input body dtos.AcceptGeneratedBillingInput true "IDs generated"
// @Success 204 "it is ok"
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /invoices/accept [post]
func (c *invoicesController) AcceptGeneratedBills(input *dtos.AcceptGeneratedBillingInput) (*webapi.Result[interface{}], *webapi.Failure) {
	c.logger.Info("AcceptGeneratedBills", zap.Any("input", input))
	if err := c.service.AcceptGeneratedBills(input); err != nil {
		c.logger.Error("AcceptGeneratedBills error", zap.Error(err))
		failure := webapi.InternalServerError(err)
		return nil, &failure
	}
	result := webapi.NoContent()
	return &result, nil
}

// ExportInvoices godoc
// @Summary Export invoices
// @Description export invoices
// @Tags invoices
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param q query string false "Search"
// @Param productions query []int false "Productions"
// @Param status query []string false "Status"
// @Param payers query []int false "Payers"
// @Param from query string false "From"
// @Param to query string false "To"
// @Param sort query []string false "Sort"
// @Success 200 {object} any
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /invoices/export [get]
func (c *invoicesController) ExportInvoices(input *dtos.ListWithFilterInput, writer gin.ResponseWriter) *webapi.Failure {
	c.logger.Info("GetInvoices")
	zero := -1
	_input := dtos.ListWithFilterInput{
		PaginatingInput: &dtos.PaginatingInput{
			Page:     &zero,
			PageSize: &zero,
		},
	}
	if input != nil {
		_input = *input
		_input.PaginatingInput = &dtos.PaginatingInput{
			Page:     &zero,
			PageSize: &zero,
		}
	}
	invoices, err := c.service.GetInvoices(&_input)
	if err != nil {
		c.logger.Error("GetInvoices error", zap.Error(err))
		failure := webapi.InternalServerError(err)
		return &failure
	}
	_writer := csv.NewWriter(writer)
	// Headers
	labels := []string{
		"ID",
		"Payer",
		"Productions",
		"Bills",
		"Amount",
		"Balance",
		"Payment Terms",
		"Date Invoice",
		"Due Date",
		"Status",
	}
	_writer.Write(labels)

	for _, row := range invoices.Items {
		_writer.Write([]string{
			row.Identifier,
			row.Payer,
			strings.Join(row.Productions, ","),
			strings.Join(convertPointerSliceToStringSlice(row.Bills), ","),
			fmt.Sprintf("%.2f", row.AmountToPay),
			fmt.Sprintf("%.2f", row.Balance),
			fmt.Sprintf("%d", row.PaymentTerms),
			row.InvoicedDate,
			row.DueDate,
			string(row.Status),
		})
	}
	writer.Header().Add("Content-Disposition", "attachment; filename=invoices.csv")
	writer.Header().Add("Content-Type", "text/csv")
	writer.Header().Add("Cache-Control", "no-cache")
	_writer.Flush()
	writer.WriteHeader(200)

	return nil
}

// RegisterPayment godoc
// @Summary Register payment
// @Description Register payment
// @Tags invoices
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param id path int true "Invoice id"
// @Param input body dtos.RegisterPaymentInput true "Register payment"
// @Success 204 "it is ok"
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /invoices/{id}/payment [post]
func (c *invoicesController) RegisterPayment(input *dtos.RegisterPaymentInput) (*webapi.Result[interface{}], *webapi.Failure) {
	c.logger.Info("RegisterPayment", zap.Any("input", input))
	if err := input.Validate(); err != nil {
		failure := webapi.BadRequest(err)
		return nil, &failure
	}
	if err := c.service.RegisterPayment(input); err != nil {
		c.logger.Error("RegisterPayment error", zap.Error(err))
		failure := webapi.InternalServerError(err)
		return nil, &failure
	}
	result := webapi.NoContent()
	return &result, nil
}
