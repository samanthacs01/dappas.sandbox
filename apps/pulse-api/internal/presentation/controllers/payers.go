package controllers

import (
	"errors"

	"go.uber.org/zap"
	"selector.dev/pulse/internal/application/dtos"
	"selector.dev/pulse/internal/application/services"
	"selector.dev/pulse/internal/domain/receivables"
	"selector.dev/webapi"
)

type PayersController interface {
	GetPayersAsNomenclator() (*webapi.Result[dtos.Nomenclators], *webapi.Failure)
	GetPayers(input *dtos.PayerFilterInput) (*webapi.Result[dtos.Payers], *webapi.Failure)
	CreatePayer(input *dtos.CreatePayerInput) (*webapi.Result[dtos.CreatedOutput], *webapi.Failure)
	DeletePayer(input *dtos.PayerDeleteInput) (*webapi.Result[interface{}], *webapi.Failure)
	GetPayerById(input *dtos.PayerByIdInput) (*webapi.Result[dtos.Payer], *webapi.Failure)
	UpdatePayer(input *dtos.UpdatePayerInput) (*webapi.Result[dtos.Payer], *webapi.Failure)
}

type payersController struct {
	logger  *zap.Logger
	service services.PayerService
}

func NewPayersController(logger *zap.Logger, service services.PayerService) PayersController {
	return &payersController{
		logger:  logger,
		service: service,
	}
}

// GetPayersAsNomenclator godoc
// @Summary Get payers as nomenclator
// @Description Get payers as nomenclator
// @Tags filters
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Success 200 {object} dtos.Nomenclators
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /filters/payers [get]
func (c *payersController) GetPayersAsNomenclator() (*webapi.Result[dtos.Nomenclators], *webapi.Failure) {
	c.logger.Info("Getting payers")
	items, err := c.service.GetPayersAsNomenclator()
	if err != nil {
		if errors.Is(err, receivables.ErrPayerNotFound) {
			notFound := webapi.NotFound(err)
			return nil, &notFound
		}
		internalError := webapi.InternalServerError(err)
		return nil, &internalError
	}

	result := webapi.Ok(*items)
	return &result, nil
}

// GetPayers godoc
// @Summary Get payers
// @Description Get payers
// @Tags payers
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param page query int false "Page"
// @Param page_size query int false "Page size"
// @Param q query string false "Search"
// @Param sort query []string false "Sort"
// @Success 200 {object} Payers
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /payers [get]
func (c *payersController) GetPayers(input *dtos.PayerFilterInput) (*webapi.Result[dtos.Payers], *webapi.Failure) {
	c.logger.Info("Getting payers", zap.Any("input", input))
	items, err := c.service.GetPayers(input)
	if err != nil {
		if errors.Is(err, receivables.ErrPayerNotFound) {
			notFound := webapi.NotFound(err)
			return nil, &notFound
		}
		internalError := webapi.InternalServerError(err)
		return nil, &internalError
	}

	result := webapi.Ok(*items)
	return &result, nil
}

// CreatePayer godoc
// @Summary Create a new payer
// @Description Create a new payer
// @Tags payers
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param input body dtos.CreatePayerInput true "Create payer input"
// @Success 201 {object} dtos.CreatedOutput
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /payers [post]
func (c *payersController) CreatePayer(input *dtos.CreatePayerInput) (*webapi.Result[dtos.CreatedOutput], *webapi.Failure) {
	created, err := c.service.CreatePayer(input)
	if err != nil {
		c.logger.Error("Error creating production", zap.Error(err))
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	success := webapi.Created(*created)
	return &success, nil
}

// DeletePayer godoc
// @Summary Delete a payer
// @Description Delete a payer
// @Tags payers
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param id path int true "Payer ID"
// @Success 204 "it is ok"
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /payers/{id} [delete]
func (c *payersController) DeletePayer(input *dtos.PayerDeleteInput) (*webapi.Result[interface{}], *webapi.Failure) {
	c.logger.Info("Deleting payer", zap.Any("input", input))

	err := c.service.DeletePayer(uint(input.Id))
	if err != nil {
		c.logger.Error("Error deleting payer", zap.Error(err))
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}

	success := webapi.NoContent()
	return &success, nil
}

// GetPayerById godoc
// @Summary Get a payer by Id
// @Description Get a payer by Id
// @Tags payers
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param id path int true "Payer ID"
// @Success 200 {object} dtos.Payer
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /payers/{id} [get]
func (c *payersController) GetPayerById(input *dtos.PayerByIdInput) (*webapi.Result[dtos.Payer], *webapi.Failure) {
	c.logger.Info("Getting payer by id")
	item, err := c.service.GetPayerById(uint(input.Id))
	if err != nil {
		c.logger.Error("Get Payer By Id", zap.Error(err))
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}

	success := webapi.Ok(*item)
	return &success, nil
}

// UpdatePayer godoc
// @Summary Update a payer
// @Description Update a payer
// @Tags payers
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param id path int true "Payer ID"
// @Param input body dtos.UpdatePayerInput true "Payer data to update"
// @Success 200 {object} dtos.Payer
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /payers/{id} [patch]
func (c *payersController) UpdatePayer(input *dtos.UpdatePayerInput) (*webapi.Result[dtos.Payer], *webapi.Failure) {
	c.logger.Info("Update Payer", zap.Any("input", input))
	updated, err := c.service.UpdatePayer(input)
	if err != nil {
		c.logger.Error("Error updating payer", zap.Error(err))
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}

	success := webapi.Ok(*updated)
	return &success, nil
}
