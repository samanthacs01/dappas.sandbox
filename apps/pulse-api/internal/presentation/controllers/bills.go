package controllers

import (
	"errors"

	"go.uber.org/zap"
	"selector.dev/pulse/config"
	"selector.dev/pulse/internal/application/dtos"
	"selector.dev/pulse/internal/application/services"
	"selector.dev/pulse/internal/domain/shared"
	"selector.dev/webapi"
)

type IBillsController interface {
	GetBills(input *dtos.BillsListInput) (*webapi.Result[dtos.Bills], *webapi.Failure)
	RegisterPayment(input *dtos.RegisterPaymentInput) (*webapi.Result[interface{}], *webapi.Failure)
	GetBillsByBillingProductionId(input *dtos.ProductionBillingBillsInput) (*webapi.Result[dtos.ProductionBillingBills], *webapi.Failure)
	GetBillsByCollectionProductionId(input *dtos.ProductionCollectionBillsInput) (*webapi.Result[dtos.ProductionCollectionBills], *webapi.Failure)
}

type billsController struct {
	logger  *zap.Logger
	service services.IBillsService
	config  config.Config
}

func NewBillsController(l *zap.Logger, s services.IBillsService, c config.Config) IBillsController {
	return &billsController{
		logger:  l,
		service: s,
		config:  c,
	}
}

// GetBills godoc
// @Summary Get bills
// @Description Get bills
// @Tags payables/bills
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param page query int false "Page"
// @Param page_size query int false "Page size"
// @Param productions query []int false "Productions"
// @Param status query []string false "Status"
// @Param sort query []string false "Sort"
// @Success 200 {object} dtos.Bills
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /payables/bills [get]
func (c *billsController) GetBills(input *dtos.BillsListInput) (*webapi.Result[dtos.Bills], *webapi.Failure) {
	bills, err := c.service.GetBills(input)

	if err != nil {
		failure := webapi.InternalServerError(err)
		return nil, &failure
	}

	result := webapi.Ok(*bills)
	return &result, nil
}

// RegisterPayment godoc
// @Summary Register payment
// @Description Register payment
// @Tags payables/bills
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param id path int true "Invoice id"
// @Param input body dtos.RegisterPaymentInput true "Register payment"
// @Success 204 "it is ok"
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /payables/bills/{id}/payment [post]
func (c *billsController) RegisterPayment(input *dtos.RegisterPaymentInput) (*webapi.Result[interface{}], *webapi.Failure) {
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

// GetBillsByBillingProductionId godoc
// @Summary Get bills of a production billing
// @Description Get bills
// @Tags payables/bills
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param page query int false "Page"
// @Param page_size query int false "Page size"
// @Param p_id query int false "Production Id"
// @Param months query []int false "Months"
// @Param status query []string false "Status"
// @Param sort query []string false "Sort"
// @Success 200 {object} dtos.ProductionBillingBills
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /payables/bills/billing [get]
func (c *billsController) GetBillsByBillingProductionId(input *dtos.ProductionBillingBillsInput) (*webapi.Result[dtos.ProductionBillingBills], *webapi.Failure) {
	role, productionId := getRoleAndEntityByToken(input.Token, c.config.GetSecretKey())
	if input.ProductionId != nil && input.ProductionId != productionId && shared.Role(role) == shared.RoleProduction {
		err := errors.New("unable to request information from others")
		fail := webapi.BadRequest(err)
		return nil, &fail
	} else if input.ProductionId == nil && shared.Role(role) == shared.RoleProduction {
		input.ProductionId = productionId
	} else if input.ProductionId == nil && shared.Role(role) == shared.RoleAdmin {
		err := errors.New("p_id is required")
		fail := webapi.BadRequest(err)
		return nil, &fail
	}

	if shared.Role(role) != shared.RoleProduction && shared.Role(role) != shared.RoleAdmin {
		fail := webapi.Unauthorized(errors.New("authorization required"))
		return nil, &fail
	}
	bills, err := c.service.GetProductionBillingBills(input)

	if err != nil {
		failure := webapi.InternalServerError(err)
		return nil, &failure
	}

	result := webapi.Ok(*bills)
	return &result, nil

}

// GetBillsByCollectionProductionId godoc
// @Summary Get bills of a production collection
// @Description Get bills
// @Tags payables/bills
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param page query int false "Page"
// @Param page_size query int false "Page size"
// @Param p_id query int false "Production Id"
// @Param payers query []int false "Payers"
// @Param status query []string false "Status"
// @Param sort query []string false "Sort"
// @Param from query string false "From"
// @Param to query string false "To"
// @Success 200 {object} dtos.ProductionCollectionBills
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /payables/bills/collection [get]
func (c *billsController) GetBillsByCollectionProductionId(input *dtos.ProductionCollectionBillsInput) (*webapi.Result[dtos.ProductionCollectionBills], *webapi.Failure) {
	role, productionId := getRoleAndEntityByToken(input.Token, c.config.GetSecretKey())
	if input.ProductionId != nil && input.ProductionId != productionId && shared.Role(role) == shared.RoleProduction {
		err := errors.New("unable to request information from others")
		fail := webapi.BadRequest(err)
		return nil, &fail
	} else if input.ProductionId == nil && shared.Role(role) == shared.RoleProduction {
		input.ProductionId = productionId
	} else if input.ProductionId == nil && shared.Role(role) == shared.RoleAdmin {
		err := errors.New("p_id is required")
		fail := webapi.BadRequest(err)
		return nil, &fail
	}

	if shared.Role(role) != shared.RoleProduction && shared.Role(role) != shared.RoleAdmin {
		fail := webapi.Unauthorized(errors.New("authorization required"))
		return nil, &fail
	}
	bills, err := c.service.GetProductionCollectionBills(input)

	if err != nil {
		failure := webapi.InternalServerError(err)
		return nil, &failure
	}

	result := webapi.Ok(*bills)
	return &result, nil
}
