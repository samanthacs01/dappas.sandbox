package controllers

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"go.uber.org/zap"
	"selector.dev/pulse/internal/application/dtos"
	"selector.dev/pulse/internal/domain/payables"
	"selector.dev/pulse/tests/mocks"
)

func TestProductionsControllers(t *testing.T) {
	t.Run("get productions successfully with default input", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewProductionService(t)
		ctrl := NewProductionsController(mocked, zap.L().WithOptions())
		data := &dtos.Productions{
			Items: []payables.ProductionListItem{
				{
					Id:         1,
					EntityName: "Production 1",
				},
			},
			Pagination: dtos.PaginationInfo{
				Total: 1,
			},
		}
		input := dtos.ProductionsFilterInput{}
		mocked.On("GetProductions", input).Return(data, nil)
		// Act
		success, fail := ctrl.GetProductions(&input)
		// Assert
		assert.NotNil(t, success)
		assert.Nil(t, fail)
		assert.Equal(t, len(data.Items), len(success.Data.Items))
		assert.Equal(t, data.Pagination.Total, success.Data.Pagination.Total)
	})
	t.Run("get productions fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewProductionService(t)
		ctrl := NewProductionsController(mocked, zap.L().WithOptions())
		input := dtos.ProductionsFilterInput{}
		mocked.On("GetProductions", input).Return(nil, assert.AnError)
		// Act
		success, fail := ctrl.GetProductions(&input)
		// Assert
		assert.Nil(t, success)
		assert.NotNil(t, fail)
		assert.Equal(t, 500, fail.Status)
	})

	t.Run("get productions not found fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewProductionService(t)
		ctrl := NewProductionsController(mocked, zap.L().WithOptions())
		input := dtos.ProductionsFilterInput{}
		mocked.On("GetProductions", input).Return(nil, payables.ErrProductionNotFound)
		// Act
		success, fail := ctrl.GetProductions(&input)
		// Assert
		assert.Nil(t, success)
		assert.NotNil(t, fail)
		assert.Equal(t, 404, fail.Status)
	})
	t.Run("get productions as nomenclator successfully", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewProductionService(t)
		ctrl := NewProductionsController(mocked, zap.L().WithOptions())
		data := &dtos.Nomenclators{
			{
				Id:   "1",
				Text: "Production 1",
			},
		}
		mocked.On("GetProductionsAsNomenclator").Return(data, nil)
		// Act
		success, fail := ctrl.GetProductionsAsNomenclator()
		// Assert
		assert.NotNil(t, success)
		assert.Nil(t, fail)
		assert.Equal(t, len(*data), len(success.Data))
	})
	t.Run("get productions as nomenclator fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewProductionService(t)
		ctrl := NewProductionsController(mocked, zap.L().WithOptions())
		mocked.On("GetProductionsAsNomenclator").Return(nil, assert.AnError)
		// Act
		success, fail := ctrl.GetProductionsAsNomenclator()
		// Assert
		assert.Nil(t, success)
		assert.NotNil(t, fail)
		assert.Equal(t, 500, fail.Status)
	})

	t.Run("get productions as nomenclator not found fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewProductionService(t)
		ctrl := NewProductionsController(mocked, zap.L().WithOptions())
		mocked.On("GetProductionsAsNomenclator").Return(nil, payables.ErrProductionNotFound)
		// Act
		success, fail := ctrl.GetProductionsAsNomenclator()
		// Assert
		assert.Nil(t, success)
		assert.NotNil(t, fail)
		assert.Equal(t, 404, fail.Status)
	})

	t.Run("create production successfully", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewProductionService(t)
		ctrl := NewProductionsController(mocked, zap.L().WithOptions())
		input := &dtos.CreateProductionInput{}
		created := &dtos.CreatedOutput{
			Id: 1,
		}
		mocked.On("CreateProduction", input).Return(created, nil)
		// Act
		success, fail := ctrl.CreateProduction(input)
		// Assert
		assert.NotNil(t, success)
		assert.Nil(t, fail)
		assert.Equal(t, created.Id, success.Data.Id)
	})
	t.Run("create production fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewProductionService(t)
		ctrl := NewProductionsController(mocked, zap.L().WithOptions())
		input := &dtos.CreateProductionInput{}
		mocked.On("CreateProduction", input).Return(nil, assert.AnError)
		// Act
		success, fail := ctrl.CreateProduction(input)
		// Assert
		assert.Nil(t, success)
		assert.NotNil(t, fail)
		assert.Equal(t, 500, fail.Status)
	})
	t.Run("delete production successfully", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewProductionService(t)
		ctrl := NewProductionsController(mocked, zap.L().WithOptions())
		input := &dtos.DeleteProductionInput{
			ID: 1,
		}
		mocked.On("DeleteProduction", input.ID).Return(nil)
		// Act
		success, fail := ctrl.DeleteProduction(input)
		// Assert
		assert.NotNil(t, success)
		assert.Nil(t, fail)
	})
	t.Run("delete production fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewProductionService(t)
		ctrl := NewProductionsController(mocked, zap.L().WithOptions())
		input := &dtos.DeleteProductionInput{
			ID: 1,
		}
		mocked.On("DeleteProduction", input.ID).Return(assert.AnError)
		// Act
		success, fail := ctrl.DeleteProduction(input)
		// Assert
		assert.Nil(t, success)
		assert.NotNil(t, fail)
		assert.Equal(t, 500, fail.Status)
	})
	t.Run("delete production not found fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewProductionService(t)
		ctrl := NewProductionsController(mocked, zap.L().WithOptions())
		input := &dtos.DeleteProductionInput{
			ID: 1,
		}
		mocked.On("DeleteProduction", input.ID).Return(payables.ErrProductionNotFound)
		// Act
		success, fail := ctrl.DeleteProduction(input)
		// Assert
		assert.Nil(t, success)
		assert.NotNil(t, fail)
		assert.Equal(t, 404, fail.Status)
	})
	t.Run("get production by id successfully", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewProductionService(t)
		ctrl := NewProductionsController(mocked, zap.L().WithOptions())
		input := &dtos.GetProductionByIDInput{
			ID: 1,
		}
		data := &dtos.ProductionResponse{
			Id: 1,
		}
		mocked.On("GetProductionByID", input.ID).Return(data, nil)
		// Act
		success, fail := ctrl.GetProductionByID(input)
		// Assert
		assert.NotNil(t, success)
		assert.Nil(t, fail)
		assert.Equal(t, data.Id, success.Data.Id)
	})

	t.Run("get production by id fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewProductionService(t)
		ctrl := NewProductionsController(mocked, zap.L().WithOptions())
		input := &dtos.GetProductionByIDInput{
			ID: 1,
		}
		mocked.On("GetProductionByID", input.ID).Return(nil, assert.AnError)
		// Act
		success, fail := ctrl.GetProductionByID(input)
		// Assert
		assert.Nil(t, success)
		assert.NotNil(t, fail)
		assert.Equal(t, 500, fail.Status)
	})
	t.Run("get production by id not found fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewProductionService(t)
		ctrl := NewProductionsController(mocked, zap.L().WithOptions())
		input := &dtos.GetProductionByIDInput{
			ID: 1,
		}
		mocked.On("GetProductionByID", input.ID).Return(nil, payables.ErrProductionNotFound)
		// Act
		success, fail := ctrl.GetProductionByID(input)
		// Assert
		assert.Nil(t, success)
		assert.NotNil(t, fail)
		assert.Equal(t, 404, fail.Status)
	})
	t.Run("update production successfully", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewProductionService(t)
		ctrl := NewProductionsController(mocked, zap.L().WithOptions())
		input := &dtos.UpdateProductionInput{}
		mocked.On("UpdateProduction", input).Return(nil)
		// Act
		success, fail := ctrl.UpdateProduction(input)
		// Assert
		assert.NotNil(t, success)
		assert.Nil(t, fail)
	})
	t.Run("update production fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewProductionService(t)
		ctrl := NewProductionsController(mocked, zap.L().WithOptions())
		input := &dtos.UpdateProductionInput{}
		mocked.On("UpdateProduction", input).Return(assert.AnError)
		// Act
		success, fail := ctrl.UpdateProduction(input)
		// Assert
		assert.Nil(t, success)
		assert.NotNil(t, fail)
		assert.Equal(t, 500, fail.Status)
	})
	t.Run("update production not found fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewProductionService(t)
		ctrl := NewProductionsController(mocked, zap.L().WithOptions())
		input := &dtos.UpdateProductionInput{}
		mocked.On("UpdateProduction", input).Return(payables.ErrProductionNotFound)
		// Act
		success, fail := ctrl.UpdateProduction(input)
		// Assert
		assert.Nil(t, success)
		assert.NotNil(t, fail)
		assert.Equal(t, 404, fail.Status)
	})
}
