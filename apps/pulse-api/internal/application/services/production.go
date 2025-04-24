package services

import (
	"errors"
	"mime/multipart"
	"strings"

	"go.uber.org/zap"
	"selector.dev/pulse/config"
	dtos "selector.dev/pulse/internal/application/dtos"
	domain "selector.dev/pulse/internal/domain/payables"
	sharedDomainServices "selector.dev/pulse/internal/domain/shared/services"
)

//go:generate mockery --name=ProductionService --output=../../../tests/mocks --filename=production_service.go
type ProductionService interface {
	GetProductions(input dtos.ProductionsFilterInput) (*dtos.Productions, error)
	GetProductionsAsNomenclator() (*dtos.Nomenclators, error)
	CreateProduction(input *dtos.CreateProductionInput) (*dtos.CreatedOutput, error)
	DeleteProduction(id uint) error
	GetProductionByID(id uint) (*dtos.ProductionResponse, error)
	UpdateProduction(input *dtos.UpdateProductionInput) error
}

type productionService struct {
	repository   domain.IProductionsRepository
	fileUploader sharedDomainServices.IFilesUploader
	logger       *zap.Logger
	fileConfig   config.FileManagerConfig
}

func NewProductionService(r domain.IProductionsRepository, fu sharedDomainServices.IFilesUploader, l *zap.Logger, fc config.FileManagerConfig) ProductionService {
	return &productionService{
		repository:   r,
		fileUploader: fu,
		logger:       l,
		fileConfig:   fc,
	}
}

var (
	ErrProductionNotFound = errors.New("production not found")
	ErrInvalidInput       = errors.New("invalid input data")
)

func (s *productionService) GetProductionsAsNomenclator() (*dtos.Nomenclators, error) {
	items, err := s.repository.FindAllProductionsAsNomenclator()
	if err != nil {
		return nil, err
	}
	productions := dtos.Nomenclators(*items)
	return &productions, nil
}

func (s *productionService) GetProductions(input dtos.ProductionsFilterInput) (*dtos.Productions, error) {
	s.logger.Info("GetProductions", zap.Any("input", input))
	page, size := input.Paginate()
	offset := (page - 1) * size

	_sorts := input.Sorts.Values()
	_sorts = append(_sorts, struct {
		Field     string
		Direction string
	}{Field: "id", Direction: "desc"})
	productions, total, err := s.repository.FindAllProductions(input.GetSearch(), &size, &offset, _sorts)
	if err != nil {
		return nil, err
	}

	result := &dtos.Productions{
		Items: *productions,
		Pagination: dtos.PaginationInfo{
			Page:    page,
			PerPage: size,
			Total:   *total,
		},
	}
	return result, nil
}

func (s *productionService) CreateProduction(input *dtos.CreateProductionInput) (*dtos.CreatedOutput, error) {
	files := []*multipart.FileHeader{
		input.Contract,
	}
	paths, err := s.fileUploader.UploadFiles(sharedDomainServices.Contracts, files)
	if err != nil {
		return nil, err
	}
	contractFilePath := (*paths)[0].FilePath
	production := domain.Production{
		EntityName:                      input.EntityName,
		Address:                         input.EntityAddress,
		ContactName:                     input.ContactName,
		ContactPhoneNumber:              input.ContactPhoneNumber,
		ContactEmail:                    input.ContactEmail,
		ProductionSplit:                 input.ProductionSplit,
		ContractFilePath:                contractFilePath,
		NetPaymentTerms:                 input.NetPaymentTerms,
		ProductionBillingType:           domain.ProductionBillingType(strings.ToLower(string(input.ProductionBillingType))),
		ProductionExpenseRecoupmentType: domain.ProductionExpenseRecoupmentType(strings.ToLower(string(input.ProductionExpenseRecoupmentType))),
	}
	createdProduction, err := s.repository.CreateProduction(&production)
	if err != nil {
		return nil, err
	}
	result := dtos.CreatedOutput{
		Id: createdProduction.Id,
	}
	return &result, nil
}

func (s *productionService) DeleteProduction(id uint) error {
	s.logger.Info("Deleting production", zap.Uint("id", id))

	err := s.repository.DeleteProductionByID(id)
	if err != nil {
		s.logger.Error("Failed to delete production", zap.Error(err))
		return err
	}

	return nil
}

func (s *productionService) GetProductionByID(id uint) (*dtos.ProductionResponse, error) {
	s.logger.Info("GetProductionByID", zap.Uint("id", id))

	production, err := s.repository.FindProductionByID(id)
	if err != nil {
		s.logger.Error("Error fetching production by ID", zap.Error(err))
		return nil, err
	}

	contract := s.fileConfig.GetRealPath(production.ContractFilePath)

	response := dtos.ProductionResponse{
		Id:                              production.Id,
		EntityName:                      production.EntityName,
		EntityAddress:                   production.Address,
		ContactName:                     production.ContactName,
		ContactPhoneNumber:              production.ContactPhoneNumber,
		ContactEmail:                    production.ContactEmail,
		ProductionSplit:                 production.ProductionSplit,
		ProductionBillingType:           production.ProductionBillingType,
		ProductionExpenseRecoupmentType: production.ProductionExpenseRecoupmentType,
		NetPaymentTerms:                 production.NetPaymentTerms,
		Contract: dtos.ContractFile{
			Name: cleanPrefix(production.ContractFilePath),
			Path: contract,
		},
	}

	return &response, nil
}

func cleanPrefix(contract string) string {
	contract = strings.TrimPrefix(contract, "/")
	contract = strings.TrimPrefix(contract, string(sharedDomainServices.Contracts))
	contract = strings.TrimPrefix(contract, "/")
	return contract
}

func (s *productionService) UpdateProduction(input *dtos.UpdateProductionInput) error {
	s.logger.Info("UpdateProduction", zap.Uint("id", input.Id), zap.Any("input", input))

	var contractFilePath string
	if input.Contract != nil {
		files := []*multipart.FileHeader{input.Contract}
		paths, err := s.fileUploader.UploadFiles(sharedDomainServices.Contracts, files)
		if err != nil {
			s.logger.Error("Error uploading contract file", zap.Error(err))
			return err
		}
		contractFilePath = (*paths)[0].FilePath
	}

	updateData := &domain.ProductionUpdateData{
		EntityName:                      input.EntityName,
		EntityAddress:                   input.EntityAddress,
		ContactName:                     input.ContactName,
		ContactPhoneNumber:              input.ContactPhoneNumber,
		ProductionSplit:                 input.ProductionSplit,
		ProductionBillingType:           domain.ProductionBillingType(strings.ToLower(string(input.ProductionBillingType))),
		ProductionExpenseRecoupmentType: domain.ProductionExpenseRecoupmentType(strings.ToLower(string(input.ProductionExpenseRecoupmentType))),
		NetPaymentTerms:                 input.NetPaymentTerms,
		ContractFilePath:                contractFilePath,
	}

	return s.repository.UpdateProduction(input.Id, updateData)
}
