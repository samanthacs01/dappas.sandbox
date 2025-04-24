package controllers

import (
	"errors"

	"go.uber.org/zap"
	"selector.dev/pulse/config"
	"selector.dev/pulse/internal/application/dtos"
	"selector.dev/pulse/internal/application/services"
	domain "selector.dev/pulse/internal/domain/expenses"
	"selector.dev/pulse/internal/domain/payables"
	"selector.dev/pulse/internal/domain/shared"
	"selector.dev/webapi"
)

type ExpensesController interface {
	GetExpenses(input *dtos.ExpenseFilterInput) (*webapi.Result[dtos.Expenses], *webapi.Failure)
	GetExpensesByProductionCollection(input *dtos.ProductionCollectionExpenseFilterInput) (*webapi.Result[dtos.Expenses], *webapi.Failure)
	CreateExpense(input *dtos.CreateExpenseInput) (*webapi.Result[dtos.CreatedOutput], *webapi.Failure)
	DeleteExpense(input *dtos.DeleteExpenseInput) (*webapi.Result[dtos.DeleteExpenseOutput], *webapi.Failure)
	GetExpense(input *dtos.GetExpenseByIdInput) (*webapi.Result[dtos.ExpenseDetails], *webapi.Failure)
	PatchExpense(input *dtos.UpdateExpenseInput) (*webapi.Result[dtos.UpdatedExpenseOutput], *webapi.Failure)
}

type expensesController struct {
	service           services.ExpensesService
	productionService services.ProductionService
	logger            *zap.Logger
	config            config.Config
}

func NewExpensesController(service services.ExpensesService, ps services.ProductionService, logger *zap.Logger, c config.Config) ExpensesController {
	return &expensesController{
		service:           service,
		productionService: ps,
		logger:            logger,
		config:            c,
	}
}

// GetExpenses godoc
// @Summary Get expenses
// @Description Get expenses with optional sorting
// @Tags expenses
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param page query int false "Page number"
// @Param page_size query int false "Number of items per page"
// @Param productions query []int false "Filter by production IDs"
// @Param month_years query []string false "Filter by month and year"
// @Param sort query []string false "Sort parameters in the format '-field' for descending order"
// @Success 200 {object} Expenses
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /expenses [get]
func (c *expensesController) GetExpenses(input *dtos.ExpenseFilterInput) (*webapi.Result[dtos.Expenses], *webapi.Failure) {
	c.logger.Info("FindAllExpenses", zap.Any("input", input))
	expenses, err := c.service.FindAllExpenses(input)
	if err != nil {
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}

	response := webapi.Ok(*expenses)
	return &response, nil
}

// CreateExpense godoc
// @Summary Create expense
// @Description Create expense
// @Tags expenses
// @Accept  multipart/form-data
// @Produce  json
// @Security BearerAuth
// @Param files formData []file true "Docs"
// @Param input formData CreateExpenseInput true "Input"
// @Success 201 {object} dtos.CreatedOutput
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /expenses [post]
func (c *expensesController) CreateExpense(input *dtos.CreateExpenseInput) (*webapi.Result[dtos.CreatedOutput], *webapi.Failure) {
	result, err := c.service.CreateExpense(input)
	if err != nil {
		if errors.Is(err, domain.ErrExpenseAfterAppliedRetentions) {
			fails := webapi.BadRequestWithCode(err, 4001)
			return nil, &fails
		}
		internalError := webapi.InternalServerError(err)
		return nil, &internalError
	}
	res := webapi.Created(*result)
	return &res, nil
}

// DeleteExpense godoc
// @Summary Delete expense
// @Description Delete expense
// @Tags expenses
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param id path int true "ID"
// @Success 200 {object} dtos.DeleteExpenseOutput
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /expenses/{id} [delete]
func (c *expensesController) DeleteExpense(input *dtos.DeleteExpenseInput) (*webapi.Result[dtos.DeleteExpenseOutput], *webapi.Failure) {
	err := c.service.DeleteExpense(input.Id)
	if err != nil {
		if errors.Is(err, domain.ErrExpenseNotFound) {
			notFound := webapi.NotFound(err)
			return nil, &notFound
		}
		if errors.Is(err, domain.ErrExpenseAfterAppliedRetentions) {
			fails := webapi.BadRequestWithCode(err, 4001)
			return nil, &fails
		}
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}

	res := webapi.Ok(dtos.DeleteExpenseOutput{Id: input.Id})
	return &res, nil
}

// GetExpense godoc
// @Summary Get expense by ID
// @Description Fetch a single expense using its ID
// @Tags expenses
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param id path int true "Expense ID"
// @Success 200 {object} dtos.ExpenseDetails
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 404 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /expenses/{id} [get]
func (c *expensesController) GetExpense(input *dtos.GetExpenseByIdInput) (*webapi.Result[dtos.ExpenseDetails], *webapi.Failure) {
	expenseDTO, err := c.service.FindExpenseById(input.Id)
	if err != nil {
		if errors.Is(err, domain.ErrExpenseNotFound) {
			notFound := webapi.NotFound(err)
			return nil, &notFound
		}
		internalError := webapi.InternalServerError(err)
		return nil, &internalError
	}
	response := webapi.Ok(*expenseDTO)
	return &response, nil
}

// PatchExpense godoc
// @Summary Update an expense
// @Description Update fields of an existing expense, including uploading new files
// @Tags expenses
// @Accept multipart/form-data
// @Produce json
// @Security BearerAuth
// @Param id path int true "Expense ID"
// @Param month formData string false "Month"
// @Param year formData string false "Year"
// @Param production_id formData int false "Production ID"
// @Param total_deduction formData number false "Total Amount"
// @Param delete_files formData []int false "IDs of files to delete"
// @Param files formData file false "Expense Documents"
// @Success 200 {object} dtos.UpdatedExpenseOutput
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 404 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /expenses/{id} [patch]
func (c *expensesController) PatchExpense(
	input *dtos.UpdateExpenseInput,
) (*webapi.Result[dtos.UpdatedExpenseOutput], *webapi.Failure) {

	updated, err := c.service.UpdateExpense(input)
	if err != nil {
		if errors.Is(err, domain.ErrExpenseNotFound) {
			notFound := webapi.NotFound(err)
			return nil, &notFound
		}
		if errors.Is(err, domain.ErrExpenseAfterAppliedRetentions) {
			fails := webapi.BadRequestWithCode(err, 4001)
			return nil, &fails
		}
		c.logger.Error("Failed to update expense", zap.Error(err))
		internalError := webapi.InternalServerError(err)
		return nil, &internalError
	}

	res := webapi.Ok(*updated)
	return &res, nil
}

// GetExpensesByProductionCollection godoc
// @Summary Get expenses by production collection
// @Description Get expenses with optional sorting
// @Tags productions
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param page query int false "Page number"
// @Param page_size query int false "Number of items per page"
// @Param p_id query int false "Production Id"
// @Param sort query []string false "Sort parameters in the format '-field' for descending order"
// @Param from query string false "From"
// @Param to query string false "To"
// @Success 200 {object} Expenses
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /productions/expenses/collection [get]
func (c *expensesController) GetExpensesByProductionCollection(input *dtos.ProductionCollectionExpenseFilterInput) (*webapi.Result[dtos.Expenses], *webapi.Failure) {
	role, productionId := getRoleAndEntityByToken(input.Token, c.config.GetSecretKey())
	c.logger.Info("GetExpensesByProductionCollection", zap.Any("input", input))
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
	prod, err := c.productionService.GetProductionByID(*input.ProductionId)
	if err != nil {
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}

	if prod.ProductionBillingType != payables.ProductionBillingTypeCollection {
		err := errors.New("production is not a collection")
		fail := webapi.BadRequest(err)
		return nil, &fail
	}

	if shared.Role(role) != shared.RoleProduction && shared.Role(role) != shared.RoleAdmin {
		fail := webapi.Unauthorized(errors.New("authorization required"))
		return nil, &fail
	}

	expenses, err := c.service.FindAllExpensesOfCollectionProduction(input)
	if err != nil {
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}

	response := webapi.Ok(*expenses)
	return &response, nil
}
