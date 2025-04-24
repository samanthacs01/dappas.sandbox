package controllers

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"go.uber.org/zap"
	"selector.dev/pulse/internal/application/dtos"
	"selector.dev/pulse/internal/domain/receivables"
	"selector.dev/pulse/tests/mocks"
)

func TestPayersControllers(t *testing.T) {
	t.Run("get payers successfully with default input", func(t *testing.T) {
		// Arrange
		data := &dtos.Payers{
			Items: []dtos.Payer{
				{
					Id:         1,
					EntityName: "Payer 1",
				},
			},
			Pagination: dtos.PaginationInfo{
				Total: 1,
			},
		}
		mocked := mocks.NewPayerService(t)
		ctrl := NewPayersController(zap.L().WithOptions(), mocked)
		input := &dtos.PayerFilterInput{}
		mocked.On("GetPayers", input).Return(data, nil)
		// Act
		result, fail := ctrl.GetPayers(input)

		// Assert
		assert.NotNil(t, result)
		assert.Nil(t, fail)
		assert.Equal(t, len(data.Items), len(result.Data.Items))
		assert.Equal(t, data.Pagination.Total, result.Data.Pagination.Total)
	})
	t.Run("get payers fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewPayerService(t)
		ctrl := NewPayersController(zap.L().WithOptions(), mocked)
		input := &dtos.PayerFilterInput{}
		mocked.On("GetPayers", input).Return(nil, assert.AnError)
		// Act
		result, fail := ctrl.GetPayers(input)

		// Assert
		assert.Nil(t, result)
		assert.NotNil(t, fail)
	})

	t.Run("get payers not found fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewPayerService(t)
		ctrl := NewPayersController(zap.L().WithOptions(), mocked)
		input := &dtos.PayerFilterInput{}
		mocked.On("GetPayers", input).Return(nil, receivables.ErrPayerNotFound)
		// Act
		result, fail := ctrl.GetPayers(input)

		// Assert
		assert.Nil(t, result)
		assert.NotNil(t, fail)
	})
	t.Run("get payers as nomenclator successfully", func(t *testing.T) {
		// Arrange
		data := dtos.Nomenclators{
			{
				Id:   "1",
				Text: "Payer 1",
			},
		}
		mocked := mocks.NewPayerService(t)
		ctrl := NewPayersController(zap.L().WithOptions(), mocked)
		mocked.On("GetPayersAsNomenclator").Return(&data, nil)
		// Act
		result, fail := ctrl.GetPayersAsNomenclator()

		// Assert
		assert.NotNil(t, result)
		assert.Nil(t, fail)
		assert.Equal(t, len(data), len(result.Data))
	})
	t.Run("get payers as nomenclator fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewPayerService(t)
		ctrl := NewPayersController(zap.L().WithOptions(), mocked)
		mocked.On("GetPayersAsNomenclator").Return(nil, assert.AnError)
		// Act
		result, fail := ctrl.GetPayersAsNomenclator()

		// Assert
		assert.Nil(t, result)
		assert.NotNil(t, fail)
	})
	t.Run("get payers as nomenclator not found fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewPayerService(t)
		ctrl := NewPayersController(zap.L().WithOptions(), mocked)
		mocked.On("GetPayersAsNomenclator").Return(nil, receivables.ErrPayerNotFound)
		// Act
		result, fail := ctrl.GetPayersAsNomenclator()

		// Assert
		assert.Nil(t, result)
		assert.NotNil(t, fail)
	})

	t.Run("update payer successfully", func(t *testing.T) {
		// Arrange
		data := &dtos.Payer{
			Id:         1,
			EntityName: "Payer 1",
		}
		mocked := mocks.NewPayerService(t)
		ctrl := NewPayersController(zap.L().WithOptions(), mocked)
		input := &dtos.UpdatePayerInput{}
		mocked.On("UpdatePayer", input).Return(data, nil)
		// Act
		result, fail := ctrl.UpdatePayer(input)

		// Assert
		assert.NotNil(t, result)
		assert.Nil(t, fail)
		assert.Equal(t, data.Id, result.Data.Id)
		assert.Equal(t, data.EntityName, result.Data.EntityName)
	})
	t.Run("update payer fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewPayerService(t)
		ctrl := NewPayersController(zap.L().WithOptions(), mocked)
		input := &dtos.UpdatePayerInput{}
		mocked.On("UpdatePayer", input).Return(nil, assert.AnError)
		// Act
		result, fail := ctrl.UpdatePayer(input)

		// Assert
		assert.Nil(t, result)
		assert.NotNil(t, fail)
	})
	t.Run("update payer not found fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewPayerService(t)
		ctrl := NewPayersController(zap.L().WithOptions(), mocked)
		input := &dtos.UpdatePayerInput{}
		mocked.On("UpdatePayer", input).Return(nil, receivables.ErrPayerNotFound)
		// Act
		result, fail := ctrl.UpdatePayer(input)

		// Assert
		assert.Nil(t, result)
		assert.NotNil(t, fail)
	})

	t.Run("get payer by id successfully", func(t *testing.T) {
		// Arrange
		data := &dtos.Payer{
			Id:         1,
			EntityName: "Payer 1",
		}
		mocked := mocks.NewPayerService(t)
		ctrl := NewPayersController(zap.L().WithOptions(), mocked)
		input := &dtos.PayerByIdInput{}
		mocked.On("GetPayerById", uint(input.Id)).Return(data, nil)
		// Act
		result, fail := ctrl.GetPayerById(input)

		// Assert
		assert.NotNil(t, result)
		assert.Nil(t, fail)
		assert.Equal(t, data.Id, result.Data.Id)
		assert.Equal(t, data.EntityName, result.Data.EntityName)
	})
	t.Run("get payer by id fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewPayerService(t)
		ctrl := NewPayersController(zap.L().WithOptions(), mocked)
		input := &dtos.PayerByIdInput{}
		mocked.On("GetPayerById", uint(input.Id)).Return(nil, assert.AnError)
		// Act
		result, fail := ctrl.GetPayerById(input)

		// Assert
		assert.Nil(t, result)
		assert.NotNil(t, fail)
	})
	t.Run("get payer by id not found fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewPayerService(t)
		ctrl := NewPayersController(zap.L().WithOptions(), mocked)
		input := &dtos.PayerByIdInput{}
		mocked.On("GetPayerById", uint(input.Id)).Return(nil, receivables.ErrPayerNotFound)
		// Act
		result, fail := ctrl.GetPayerById(input)

		// Assert
		assert.Nil(t, result)
		assert.NotNil(t, fail)
	})

	t.Run("delete payer successfully", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewPayerService(t)
		ctrl := NewPayersController(zap.L().WithOptions(), mocked)
		input := &dtos.PayerDeleteInput{}
		mocked.On("DeletePayer", uint(input.Id)).Return(nil)
		// Act
		result, fail := ctrl.DeletePayer(input)

		// Assert
		assert.NotNil(t, result)
		assert.Nil(t, fail)
	})
	t.Run("delete payer fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewPayerService(t)
		ctrl := NewPayersController(zap.L().WithOptions(), mocked)
		input := &dtos.PayerDeleteInput{}
		mocked.On("DeletePayer", uint(input.Id)).Return(assert.AnError)
		// Act
		result, fail := ctrl.DeletePayer(input)

		// Assert
		assert.Nil(t, result)
		assert.NotNil(t, fail)
	})

	t.Run("create payer successfully", func(t *testing.T) {
		// Arrange
		data := &dtos.CreatedOutput{
			Id: 1,
		}
		mocked := mocks.NewPayerService(t)
		ctrl := NewPayersController(zap.L().WithOptions(), mocked)
		input := &dtos.CreatePayerInput{}
		mocked.On("CreatePayer", input).Return(data, nil)
		// Act
		result, fail := ctrl.CreatePayer(input)

		// Assert
		assert.NotNil(t, result)
		assert.Nil(t, fail)
		assert.Equal(t, data.Id, result.Data.Id)
	})
	t.Run("create payer fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewPayerService(t)
		ctrl := NewPayersController(zap.L().WithOptions(), mocked)
		input := &dtos.CreatePayerInput{}
		mocked.On("CreatePayer", input).Return(nil, assert.AnError)
		// Act
		result, fail := ctrl.CreatePayer(input)

		// Assert
		assert.Nil(t, result)
		assert.NotNil(t, fail)
	})

}
