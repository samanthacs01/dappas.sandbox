package controllers

import (
	"errors"

	"go.uber.org/zap"
	"selector.dev/pulse/config"
	"selector.dev/pulse/internal/application/dtos"
	"selector.dev/pulse/internal/domain/payables"
	"selector.dev/webapi"
)

type IProductionStatsController interface {
	GetProductionStatsKpi(input *dtos.ProductionStatsInput) (*webapi.Result[payables.ProductionStats], *webapi.Failure)
	GetKpiDetailsByTypeAndDateRange(input *dtos.ProductionStatsInput) (*webapi.Result[[]payables.PayablesKpiDetailsItem], *webapi.Failure)
}

type productionStatsController struct {
	logger     *zap.Logger
	repository payables.IProductionsRepository
	config     config.Config
}

func NewProductionStatsController(logger *zap.Logger, r payables.IProductionsRepository, c config.Config) IProductionStatsController {
	return &productionStatsController{
		logger:     logger,
		repository: r,
		config:     c,
	}
}

// GetProductionStatsKpi godoc
// @Summary Get production stats KPI
// @Description Get production stats KPI
// @Tags production-details/overview
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id query int false "Production ID if user is production role wll by take from token"
// @Param from query string true "From: yyyy-mm-dd"
// @Param to query string true "To: yyyy-mm-dd"
// @Success 200 {object} payables.ProductionStats
// @Router /production-details/overview/stats [get]
func (c *productionStatsController) GetProductionStatsKpi(input *dtos.ProductionStatsInput) (*webapi.Result[payables.ProductionStats], *webapi.Failure) {
	secret := []byte(c.config.GetSecretKey())
	role, entity := getRoleAndEntityByToken(input.GetToken(), secret)
	c.logger.Info("Role and entity", zap.String("role", role), zap.Any("entity", entity))
	id := input.Id
	if role == "production" && id != nil && entity != id {
		fail := webapi.Unauthorized(errors.New("you are not allowed to access this production"))
		return nil, &fail
	} else if id == nil {
		fail := webapi.BadRequest(errors.New("id is required"))
		return nil, &fail
	} else if role == "production" {
		id = entity
	}

	c.logger.Info("ID", zap.Any("id", id), zap.Any("entity", entity))
	stats, err := c.repository.GetProductionStatsKpi(*id, input.From, input.To)
	if err != nil {
		c.logger.Error("Error while getting production stats KPI", zap.Error(err))
		fail := webapi.InternalServerError(errors.New("error while getting production stats KPI"))
		return nil, &fail
	}
	result := webapi.Ok(stats)

	return &result, nil
}

// GetKpiDetailsByTypeAndDateRange  godoc
// @Summary Get KPI details by type and date range
// @Description Get KPI details by type and date range
// @Tags production-details/overview
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param id query int false "Production ID if user is production role wll by take from token"
// @Param from query string true "From: yyyy-mm-dd"
// @Param to query string true "To: yyyy-mm-dd"
// @Param type path string true "Type: production_details_bookings, production_details_net_revenues"
// @Success 200 {object} []payables.PayablesKpiDetailsItem
// @failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /production-details/overview/stats/{type} [get]
func (c *productionStatsController) GetKpiDetailsByTypeAndDateRange(input *dtos.ProductionStatsInput) (*webapi.Result[[]payables.PayablesKpiDetailsItem], *webapi.Failure) {
	secret := []byte(c.config.GetSecretKey())
	role, entity := getRoleAndEntityByToken(input.GetToken(), secret)
	c.logger.Info("Role and entity", zap.String("role", role), zap.Any("entity", entity))
	id := input.Id
	if role == "production" && id != nil && entity != id {
		fail := webapi.Unauthorized(errors.New("you are not allowed to access this production"))
		return nil, &fail
	} else if id == nil {
		fail := webapi.BadRequest(errors.New("id is required"))
		return nil, &fail
	} else if role == "production" {
		id = entity
	}

	c.logger.Info("ID", zap.Any("id", id), zap.Any("entity", entity))
	kpi, err := c.repository.GetProductionDetailsStatsKpiDetails(*id, input.Type, input.From, input.To)
	if err != nil {
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	result := webapi.Ok(kpi)
	return &result, nil
}
