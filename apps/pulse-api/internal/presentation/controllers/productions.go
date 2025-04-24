package controllers

import (
	"errors"

	"go.uber.org/zap"
	"selector.dev/pulse/internal/application/dtos"
	"selector.dev/pulse/internal/application/services"
	"selector.dev/pulse/internal/domain/payables"
	"selector.dev/webapi"
)

type ProductionsController interface {
	GetProductions(input *dtos.ProductionsFilterInput) (*webapi.Result[dtos.Productions], *webapi.Failure)
	GetProductionsAsNomenclator() (*webapi.Result[dtos.Nomenclators], *webapi.Failure)
	CreateProduction(input *dtos.CreateProductionInput) (*webapi.Result[dtos.CreatedOutput], *webapi.Failure)
	DeleteProduction(input *dtos.DeleteProductionInput) (*webapi.Result[dtos.DeletedOutput], *webapi.Failure)
	GetProductionByID(id *dtos.GetProductionByIDInput) (*webapi.Result[dtos.ProductionResponse], *webapi.Failure)
	UpdateProduction(input *dtos.UpdateProductionInput) (*webapi.Result[interface{}], *webapi.Failure)
}

type productionsController struct {
	service services.ProductionService
	logger  *zap.Logger
}

func NewProductionsController(service services.ProductionService, logger *zap.Logger) ProductionsController {
	return &productionsController{
		service: service,
		logger:  logger,
	}
}

// GetProductionsAsNomenclator godoc
// @Summary Get productions as nomenclator
// @Description returns a list of productions as nomenclator
// @Tags filters
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Success 200 {object} dtos.Nomenclators
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /filters/productions [get]
func (c *productionsController) GetProductionsAsNomenclator() (*webapi.Result[dtos.Nomenclators], *webapi.Failure) {
	items, err := c.service.GetProductionsAsNomenclator()
	if err != nil {
		c.logger.Error("Error getting productions as nomenclator", zap.Error(err))
		if errors.Is(err, payables.ErrProductionNotFound) {
			fail := webapi.NotFound(err)
			return nil, &fail
		}
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	success := webapi.Ok(*items)
	return &success, nil
}

// CreateProduction godoc
// @Summary Create a new production
// @Description Create a new production
// @Tags productions
// @Accept  multipart/form-data
// @Produce  json
// @Security BearerAuth
// @Param contract_file formData []file true "Contact file"
// @Param input formData dtos.CreateProductionInput true "Create production input"
// @Success 201 {object} dtos.CreatedOutput
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /productions [post]
func (c *productionsController) CreateProduction(input *dtos.CreateProductionInput) (*webapi.Result[dtos.CreatedOutput], *webapi.Failure) {
	created, err := c.service.CreateProduction(input)
	if err != nil {
		c.logger.Error("Error creating production", zap.Error(err))
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	success := webapi.Created(*created)
	return &success, nil
}

// GetProductions godoc
// @Summary Get productions
// @Description returns a list of productions
// @Tags productions
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param page query int false "Page"
// @Param page_size query int false "Page size"
// @Param q query string false "Search"
// @Param sort query []string false "Sort"
// @Success 200 {object} Productions
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /productions [get]
func (c *productionsController) GetProductions(input *dtos.ProductionsFilterInput) (*webapi.Result[dtos.Productions], *webapi.Failure) {
	productions, err := c.service.GetProductions(*input)
	if err != nil {
		c.logger.Error("Error getting productions", zap.Error(err))
		if errors.Is(err, payables.ErrProductionNotFound) {
			fail := webapi.NotFound(err)
			return nil, &fail
		}
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	success := webapi.Ok(*productions)
	return &success, nil
}

// DeleteProduction godoc
// @Summary Delete a production
// @Description Deletes a production by ID
// @Tags productions
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param id path int true "Production ID"
// @Success 200 {object} dtos.DeletedOutput
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 404 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /productions/{id} [delete]
func (c *productionsController) DeleteProduction(input *dtos.DeleteProductionInput) (*webapi.Result[dtos.DeletedOutput], *webapi.Failure) {
	err := c.service.DeleteProduction(input.ID)
	if err != nil {
		c.logger.Error("Error deleting production", zap.Error(err))
		if errors.Is(err, payables.ErrProductionNotFound) {
			fail := webapi.NotFound(err)
			return nil, &fail
		}
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	success := webapi.Ok(dtos.DeletedOutput{ID: input.ID})
	return &success, nil
}

// GetProductionByID godoc
// @Summary Get production by ID
// @Description returns a production by ID
// @Tags productions
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param id path int true "Production ID"
// @Success 200 {object} dtos.ProductionResponse
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 404 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /productions/{id} [get]
func (c *productionsController) GetProductionByID(id *dtos.GetProductionByIDInput) (*webapi.Result[dtos.ProductionResponse], *webapi.Failure) {
	production, err := c.service.GetProductionByID(id.ID)
	if err != nil {
		c.logger.Error("Error getting production by ID", zap.Error(err))
		if errors.Is(err, payables.ErrProductionNotFound) {
			fail := webapi.NotFound(err)
			return nil, &fail
		}
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	success := webapi.Ok(*production)
	return &success, nil
}

// UpdateProduction godoc
// @Summary Update a production
// @Description Update a production by ID
// @Tags productions
// @Accept  multipart/form-data
// @Produce  json
// @Security BearerAuth
// @Param id path int true "Production ID"
// @Param contract_file formData []file false "Contact file"
// @Param input formData dtos.UpdateProductionInput true "Update production input"
// @Success 204 "it is ok"
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 404 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /productions/{id} [patch]
func (c *productionsController) UpdateProduction(input *dtos.UpdateProductionInput) (*webapi.Result[interface{}], *webapi.Failure) {
	err := c.service.UpdateProduction(input)
	if err != nil {
		c.logger.Error("Error updating production", zap.Error(err))
		if errors.Is(err, payables.ErrProductionNotFound) {
			fail := webapi.NotFound(err)
			return nil, &fail
		}
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	success := webapi.NoContent()
	return &success, nil
}
