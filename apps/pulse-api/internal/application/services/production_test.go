package services

import (
	"mime/multipart"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"go.uber.org/zap"
	"selector.dev/pulse/internal/application/dtos"
	"selector.dev/pulse/internal/domain/payables"
	sDom "selector.dev/pulse/internal/domain/shared"
	shared "selector.dev/pulse/internal/domain/shared/services"
	"selector.dev/pulse/tests/mocks"
)

func TestProductionService_CreateProduction(t *testing.T) {
	t.Run("create a production when all data is correct", func(t *testing.T) {
		// Arrange
		data := &dtos.CreateProductionInput{
			ContactEmail:       "test@mail.com",
			ContactName:        "Test",
			ContactPhoneNumber: "123456789",
			EntityName:         "Test",
			EntityAddress:      "Test",
		}
		fileUploader := mocks.NewIFilesUploader(t)
		mocked := mocks.NewIProductionsRepository(t)
		fileUploader.On("UploadFiles", shared.FileType("contracts"), []*multipart.FileHeader{data.Contract}).Return(&[]shared.UploadedFile{{FilePath: "/", FileName: ""}}, nil)
		mocked.On("CreateProduction", mock.AnythingOfType("*payables.Production")).Return(&payables.Production{Id: uint(1)}, nil)
		service := NewProductionService(mocked, fileUploader, nil, nil)
		// Act
		created, err := service.CreateProduction(data)
		// Assert
		assert.NotNil(t, created)
		assert.Nil(t, err)
		assert.Equal(t, uint(1), created.Id)
	})

	t.Run("error creating a production when contact email is take", func(t *testing.T) {
		data := &dtos.CreateProductionInput{
			ContactEmail:       "test@mail.com",
			ContactName:        "Test",
			ContactPhoneNumber: "123456789",
			EntityName:         "Test",
			EntityAddress:      "Test",
		}
		fileUploader := mocks.NewIFilesUploader(t)
		mocked := mocks.NewIProductionsRepository(t)
		fileUploader.On("UploadFiles", shared.FileType("contracts"), []*multipart.FileHeader{data.Contract}).Return(&[]shared.UploadedFile{{FilePath: "/", FileName: ""}}, nil)
		mocked.On("CreateProduction", mock.AnythingOfType("*payables.Production")).Return(nil, assert.AnError)
		service := NewProductionService(mocked, fileUploader, nil, nil)
		// Act
		created, err := service.CreateProduction(data)
		// Assert
		assert.Nil(t, created)
		assert.NotNil(t, err)
		assert.Equal(t, assert.AnError, err)
	})

	t.Run("error creating a production when fail upload the contract", func(t *testing.T) {
		data := &dtos.CreateProductionInput{}
		fileUploader := mocks.NewIFilesUploader(t)
		mocked := mocks.NewIProductionsRepository(t)
		fileUploader.On("UploadFiles", shared.FileType("contracts"), []*multipart.FileHeader{data.Contract}).Return(nil, assert.AnError)

		service := NewProductionService(mocked, fileUploader, nil, nil)
		// Act
		created, err := service.CreateProduction(data)
		// Assert
		assert.Nil(t, created)
		assert.NotNil(t, err)
		assert.Equal(t, assert.AnError, err)
	})
}

func TestProductionsService_GetProductionAsNomenclator(t *testing.T) {
	t.Run("get production as nomenclator when all is successfully", func(t *testing.T) {
		// Arrange
		data := []sDom.Nomenclator{
			{Id: "1", Text: "AS1"},
			{Id: "2", Text: "AS2"},
		}
		mocked := mocks.NewIProductionsRepository(t)
		mocked.On("FindAllProductionsAsNomenclator").Return(&data, nil)
		service := NewProductionService(mocked, nil, zap.L(), nil)
		// Act
		result, err := service.GetProductionsAsNomenclator()
		// Assert
		assert.Nil(t, err)
		assert.NotNil(t, result)
		assert.Equal(t, len(data), len(*result))
	})

	t.Run("get production as nomenclator when fail", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewIProductionsRepository(t)
		mocked.On("FindAllProductionsAsNomenclator").Return(nil, assert.AnError)
		service := NewProductionService(mocked, nil, zap.L(), nil)
		// Act
		result, err := service.GetProductionsAsNomenclator()
		// Assert
		assert.NotNil(t, err)
		assert.Nil(t, result)
		assert.Equal(t, assert.AnError, err)
	})
}

func TestProductionServices_DeleteProduction(t *testing.T) {
	t.Run("delete production when all is successfully", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewIProductionsRepository(t)
		mocked.On("DeleteProductionByID", uint(1)).Return(nil)
		service := NewProductionService(mocked, nil, zap.L(), nil)
		// Act
		err := service.DeleteProduction(uint(1))
		// Assert
		assert.Nil(t, err)
	})

	t.Run("delete production when fail", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewIProductionsRepository(t)
		mocked.On("DeleteProductionByID", uint(1)).Return(assert.AnError)
		service := NewProductionService(mocked, nil, zap.L(), nil)
		// Act
		err := service.DeleteProduction(uint(1))
		// Assert
		assert.NotNil(t, err)
		assert.Equal(t, assert.AnError, err)
	})
}

func TestProductionServices_GetProductionByID(t *testing.T) {

	t.Run("get production by id when all is successfully", func(t *testing.T) {
		// Arrange
		data := &payables.Production{Id: uint(1), ContactEmail: "", ContactName: "", ContactPhoneNumber: "", Address: "", EntityName: ""}
		mocked := mocks.NewIProductionsRepository(t)
		mocked.On("FindProductionByID", uint(1)).Return(data, nil)
		mockedConfig := mocks.NewFileManagerConfig(t)
		mockedConfig.On("GetRealPath", mock.Anything).Return("http://test.com")
		service := NewProductionService(mocked, nil, zap.L(), mockedConfig)
		// Act
		result, err := service.GetProductionByID(uint(1))
		// Assert
		assert.Nil(t, err)
		assert.NotNil(t, result)
		assert.Equal(t, data.Id, result.Id)
	})

	t.Run("get production by id when fail", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewIProductionsRepository(t)
		mocked.On("FindProductionByID", uint(1)).Return(nil, assert.AnError)

		service := NewProductionService(mocked, nil, zap.L(), nil)
		// Act
		result, err := service.GetProductionByID(uint(1))
		// Assert
		assert.NotNil(t, err)
		assert.Nil(t, result)
		assert.Equal(t, assert.AnError, err)
	})
}

func TestProductionServices_UpdateProduction(t *testing.T) {
	data := &dtos.UpdateProductionInput{
		ContactName:        "",
		ContactPhoneNumber: "",
		EntityAddress:      "",
		EntityName:         "",
		Id:                 1,
	}
	t.Run("update production when all is successfully", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewIProductionsRepository(t)
		mocked.On("UpdateProduction", data.Id, mock.AnythingOfType("*payables.ProductionUpdateData")).Return(nil)
		service := NewProductionService(mocked, nil, zap.L(), nil)
		// Act
		err := service.UpdateProduction(data)
		// Assert
		assert.Nil(t, err)
	})

	t.Run("update production when fail", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewIProductionsRepository(t)
		mocked.On("UpdateProduction", data.Id, mock.AnythingOfType("*payables.ProductionUpdateData")).Return(assert.AnError)
		service := NewProductionService(mocked, nil, zap.L(), nil)
		// Act
		err := service.UpdateProduction(data)
		// Assert
		assert.NotNil(t, err)
		assert.Equal(t, assert.AnError, err)
	})
}

func TestProductionServices_GetProductions(t *testing.T) {
	input := dtos.ProductionsFilterInput{}
	t.Run("get productions when all is successfully", func(t *testing.T) {
		// Arrange
		data := []payables.ProductionListItem{
			{Id: 1, EntityName: ""},
			{Id: 2, EntityName: ""},
		}
		total := int64(2)
		mocked := mocks.NewIProductionsRepository(t)
		mocked.On("FindAllProductions", mock.AnythingOfType("*string"), mock.AnythingOfType("*int"), mock.AnythingOfType("*int"), mock.Anything).Return(&data, &total, nil)
		service := NewProductionService(mocked, nil, zap.L(), nil)
		// Act
		result, err := service.GetProductions(input)
		// Assert
		assert.Nil(t, err)
		assert.NotNil(t, result)
		assert.Equal(t, len(data), len(result.Items))
		assert.Equal(t, total, result.Pagination.Total)
	})

	t.Run("get productions when fail", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewIProductionsRepository(t)
		mocked.On("FindAllProductions", mock.AnythingOfType("*string"), mock.AnythingOfType("*int"), mock.AnythingOfType("*int"), mock.Anything).Return(nil, nil, assert.AnError)
		service := NewProductionService(mocked, nil, zap.L(), nil)
		// Act
		result, err := service.GetProductions(input)
		// Assert
		assert.NotNil(t, err)
		assert.Nil(t, result)
		assert.Equal(t, assert.AnError, err)
	})
}
