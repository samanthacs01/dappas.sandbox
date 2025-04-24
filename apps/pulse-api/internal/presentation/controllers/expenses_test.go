package controllers

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"go.uber.org/zap"
	"selector.dev/pulse/internal/application/dtos"
	"selector.dev/pulse/internal/domain/expenses"
	"selector.dev/pulse/tests/mocks"
)

func TestExpensesController(t *testing.T) {
	mockedProdS := mocks.NewProductionService(t)
	mockedConfig := mocks.NewConfig(t)
	t.Run("get expenses successfully when input is empty", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewExpensesService(t)
		data := dtos.Expenses{
			Items: []expenses.Expense{
				{
					Id:             1,
					ProductionName: "Production 1",
					ProductionId:   1,
					Month:          "January",
					Year:           "2021",
					TotalAmount:    1000,
				},
			},
			Pagination: dtos.PaginationInfo{
				Total: 1,
			},
		}
		input := &dtos.ExpenseFilterInput{}

		mocked.On("FindAllExpenses", input).Return(&data, nil)
		controller := NewExpensesController(mocked, mockedProdS, zap.L().WithOptions(), mockedConfig)
		// Act
		result, fail := controller.GetExpenses(input)
		// Assert
		assert.Nil(t, fail)
		assert.NotNil(t, result)
		assert.Equal(t, len(data.Items), len(result.Data.Items))
		assert.Equal(t, data.Pagination.Total, result.Data.Pagination.Total)
	})

	t.Run("get fails after request expenses", func(t *testing.T) {
		//Arrange
		mocked := mocks.NewExpensesService(t)
		err := errors.New("error")
		mocked.On("FindAllExpenses", mock.AnythingOfType("*dtos.ExpenseFilterInput")).Return(
			func(input *dtos.ExpenseFilterInput) *dtos.Expenses {
				return nil
			},
			func(input *dtos.ExpenseFilterInput) error {
				return err
			},
		)
		controller := NewExpensesController(mocked, mockedProdS, zap.L().WithOptions(), mockedConfig)
		input := &dtos.ExpenseFilterInput{}
		// Act
		result, fail := controller.GetExpenses(input)
		// Assert
		assert.NotNil(t, fail)
		assert.Nil(t, result)
		assert.Equal(t, 500, fail.Status)
		assert.Equal(t, "Internal Server Error", fail.Data.Title)
		assert.Equal(t, err.Error(), fail.Data.Detail)
	})

	t.Run("create expense successfully", func(t *testing.T) {
		// Arrange
		data := dtos.CreatedOutput{Id: 1}
		mocked := mocks.NewExpensesService(t)
		mocked.On("CreateExpense", mock.AnythingOfType("*dtos.CreateExpenseInput")).Return(&data, nil)
		controller := NewExpensesController(mocked, mockedProdS, zap.L().WithOptions(), mockedConfig)
		input := &dtos.CreateExpenseInput{}
		// Act
		result, fail := controller.CreateExpense(input)
		// Assert
		assert.Nil(t, fail)
		assert.NotNil(t, result)
		assert.Equal(t, 201, result.Status)
		assert.Equal(t, data.Id, result.Data.Id)
	})

	t.Run("create expense fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewExpensesService(t)
		err := errors.New("error")
		mocked.On("CreateExpense", mock.AnythingOfType("*dtos.CreateExpenseInput")).Return(
			func(input *dtos.CreateExpenseInput) *dtos.CreatedOutput {
				return nil
			},
			func(input *dtos.CreateExpenseInput) error {
				return err
			},
		)
		controller := NewExpensesController(mocked, mockedProdS, zap.L().WithOptions(), mockedConfig)
		input := &dtos.CreateExpenseInput{}
		// Act
		result, fail := controller.CreateExpense(input)
		// Assert
		assert.NotNil(t, fail)
		assert.Nil(t, result)
		assert.Equal(t, 500, fail.Status)
		assert.Equal(t, "Internal Server Error", fail.Data.Title)
		assert.Equal(t, err.Error(), fail.Data.Detail)
	})

	t.Run("crete expense fails with domain error", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewExpensesService(t)

		mocked.On("CreateExpense", mock.AnythingOfType("*dtos.CreateExpenseInput")).Return(nil, expenses.ErrExpenseAfterAppliedRetentions)
		controller := NewExpensesController(mocked, mockedProdS, zap.L().WithOptions(), mockedConfig)
		input := &dtos.CreateExpenseInput{}
		// Act
		result, fail := controller.CreateExpense(input)
		// Assert
		assert.NotNil(t, fail)
		assert.Nil(t, result)
		assert.Equal(t, 400, fail.Status)
		assert.Equal(t, "Bad Request", fail.Data.Title)
		assert.Equal(t, expenses.ErrExpenseAfterAppliedRetentions.Error(), fail.Data.Detail)
	})

	t.Run("delete expense successfully", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewExpensesService(t)
		mocked.On("DeleteExpense", uint(1)).Return(nil)
		controller := NewExpensesController(mocked, mockedProdS, zap.L().WithOptions(), mockedConfig)
		input := &dtos.DeleteExpenseInput{Id: 1}
		// Act
		result, fail := controller.DeleteExpense(input)
		// Assert
		assert.Nil(t, fail)
		assert.NotNil(t, result)
		assert.Equal(t, 200, result.Status)
		assert.Equal(t, input.Id, result.Data.Id)
	})

	t.Run("delete expense fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewExpensesService(t)
		err := errors.New("error")
		mocked.On("DeleteExpense", uint(1)).Return(err)
		controller := NewExpensesController(mocked, mockedProdS, zap.L().WithOptions(), mockedConfig)
		input := &dtos.DeleteExpenseInput{Id: 1}
		// Act
		result, fail := controller.DeleteExpense(input)
		// Assert
		assert.NotNil(t, fail)
		assert.Nil(t, result)
		assert.Equal(t, 500, fail.Status)
		assert.Equal(t, "Internal Server Error", fail.Data.Title)
		assert.Equal(t, err.Error(), fail.Data.Detail)
	})

	t.Run("delete expense not found fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewExpensesService(t)
		err := expenses.ErrExpenseNotFound
		mocked.On("DeleteExpense", uint(1)).Return(err)
		controller := NewExpensesController(mocked, mockedProdS, zap.L().WithOptions(), mockedConfig)
		input := &dtos.DeleteExpenseInput{Id: 1}
		// Act
		result, fail := controller.DeleteExpense(input)
		// Assert
		assert.NotNil(t, fail)
		assert.Nil(t, result)
		assert.Equal(t, 404, fail.Status)
		assert.Equal(t, "Not found", fail.Data.Title)
		assert.Equal(t, err.Error(), fail.Data.Detail)
	})

	t.Run("delete expense after applied retention fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewExpensesService(t)
		err := expenses.ErrExpenseAfterAppliedRetentions
		mocked.On("DeleteExpense", uint(1)).Return(err)
		controller := NewExpensesController(mocked, mockedProdS, zap.L().WithOptions(), mockedConfig)
		input := &dtos.DeleteExpenseInput{Id: 1}
		// Act
		result, fail := controller.DeleteExpense(input)
		// Assert
		assert.NotNil(t, fail)
		assert.Nil(t, result)
		assert.Equal(t, 400, fail.Status)
		assert.Equal(t, "Bad Request", fail.Data.Title)
		assert.Equal(t, err.Error(), fail.Data.Detail)
	})

	t.Run("get expense successfully", func(t *testing.T) {
		// Arrange
		data := dtos.ExpenseDetails{
			Expense: &expenses.Expense{
				Id:             1,
				ProductionName: "Production 1",
				ProductionId:   1,
				Month:          "January",
				Year:           "2021",
				TotalAmount:    1000,
			},
			Files: []expenses.ExpenseDoc{
				{
					Id:        1,
					ExpenseId: 1,
					DocName:   "Doc 1",
					DocPath:   "path/to/doc",
				},
			},
		}
		mocked := mocks.NewExpensesService(t)
		mocked.On("FindExpenseById", uint(1)).Return(&data, nil)
		controller := NewExpensesController(mocked, mockedProdS, zap.L().WithOptions(), mockedConfig)
		input := &dtos.GetExpenseByIdInput{Id: 1}
		// Act
		result, fail := controller.GetExpense(input)
		// Assert
		assert.Nil(t, fail)
		assert.NotNil(t, result)
		assert.Equal(t, 200, result.Status)
		assert.Equal(t, data.Id, result.Data.Id)
		assert.Equal(t, data.ProductionName, result.Data.ProductionName)
		assert.Equal(t, data.TotalAmount, result.Data.TotalAmount)
		assert.Equal(t, data.ProductionId, result.Data.ProductionId)
		assert.Equal(t, data.Year, result.Data.Year)
		assert.Equal(t, data.Month, result.Data.Month)
		assert.Equal(t, len(data.Files), len(result.Data.Files))
	})

	t.Run("get expense fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewExpensesService(t)
		err := errors.New("error")
		mocked.On("FindExpenseById", uint(1)).Return(nil, err)
		controller := NewExpensesController(mocked, mockedProdS, zap.L().WithOptions(), mockedConfig)
		input := &dtos.GetExpenseByIdInput{Id: 1}
		// Act
		result, fail := controller.GetExpense(input)
		// Assert
		assert.NotNil(t, fail)
		assert.Nil(t, result)
		assert.Equal(t, 500, fail.Status)
		assert.Equal(t, "Internal Server Error", fail.Data.Title)
		assert.Equal(t, err.Error(), fail.Data.Detail)
	})
	t.Run("get expense not found fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewExpensesService(t)
		err := expenses.ErrExpenseNotFound
		mocked.On("FindExpenseById", uint(1)).Return(nil, err)
		controller := NewExpensesController(mocked, mockedProdS, zap.L().WithOptions(), mockedConfig)
		input := &dtos.GetExpenseByIdInput{Id: 1}
		// Act
		result, fail := controller.GetExpense(input)
		// Assert
		assert.NotNil(t, fail)
		assert.Nil(t, result)
		assert.Equal(t, 404, fail.Status)
		assert.Equal(t, "Not found", fail.Data.Title)
		assert.Equal(t, err.Error(), fail.Data.Detail)
	})
	t.Run("update expense successfully", func(t *testing.T) {
		// Arrange
		data := dtos.UpdatedExpenseOutput{Id: 1}
		mocked := mocks.NewExpensesService(t)
		mocked.On("UpdateExpense", mock.AnythingOfType("*dtos.UpdateExpenseInput")).Return(&data, nil)
		controller := NewExpensesController(mocked, mockedProdS, zap.L().WithOptions(), mockedConfig)
		input := &dtos.UpdateExpenseInput{}
		// Act
		result, fail := controller.PatchExpense(input)
		// Assert
		assert.Nil(t, fail)
		assert.NotNil(t, result)
		assert.Equal(t, 200, result.Status)
		assert.Equal(t, data.Id, result.Data.Id)
	})
	t.Run("update expense fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewExpensesService(t)
		err := errors.New("error")
		mocked.On("UpdateExpense", mock.AnythingOfType("*dtos.UpdateExpenseInput")).Return(nil, err)
		controller := NewExpensesController(mocked, mockedProdS, zap.L().WithOptions(), mockedConfig)
		input := &dtos.UpdateExpenseInput{}
		// Act
		result, fail := controller.PatchExpense(input)
		// Assert
		assert.NotNil(t, fail)
		assert.Nil(t, result)
		assert.Equal(t, 500, fail.Status)
		assert.Equal(t, "Internal Server Error", fail.Data.Title)
		assert.Equal(t, err.Error(), fail.Data.Detail)
	})
	t.Run("update expense not found fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewExpensesService(t)
		err := expenses.ErrExpenseNotFound
		mocked.On("UpdateExpense", mock.AnythingOfType("*dtos.UpdateExpenseInput")).Return(nil, err)
		controller := NewExpensesController(mocked, mockedProdS, zap.L().WithOptions(), mockedConfig)
		input := &dtos.UpdateExpenseInput{}
		// Act
		result, fail := controller.PatchExpense(input)
		// Assert
		assert.NotNil(t, fail)
		assert.Nil(t, result)
		assert.Equal(t, 404, fail.Status)
		assert.Equal(t, "Not found", fail.Data.Title)
		assert.Equal(t, err.Error(), fail.Data.Detail)
	})
	t.Run("update expense after applied retentions fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewExpensesService(t)
		err := expenses.ErrExpenseAfterAppliedRetentions
		mocked.On("UpdateExpense", mock.AnythingOfType("*dtos.UpdateExpenseInput")).Return(nil, err)
		controller := NewExpensesController(mocked, mockedProdS, zap.L().WithOptions(), mockedConfig)
		input := &dtos.UpdateExpenseInput{}
		// Act
		result, fail := controller.PatchExpense(input)
		// Assert
		assert.NotNil(t, fail)
		assert.Nil(t, result)
		assert.Equal(t, 400, fail.Status)
		assert.Equal(t, "Bad Request", fail.Data.Title)
		assert.Equal(t, err.Error(), fail.Data.Detail)
	})
}
