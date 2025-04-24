package services

import (
	"go.uber.org/zap"
	dtos "selector.dev/pulse/internal/application/dtos"
	domain "selector.dev/pulse/internal/domain/receivables"
	"selector.dev/utils"
)

//go:generate mockery --name=PayerService --output=../../../tests/mocks --filename=payers_service.go
type PayerService interface {
	GetPayersAsNomenclator() (*dtos.Nomenclators, error)
	GetPayers(input *dtos.PayerFilterInput) (*dtos.Payers, error)
	CreatePayer(input *dtos.CreatePayerInput) (*dtos.CreatedOutput, error)
	GetPayerById(id uint) (*dtos.Payer, error)
	DeletePayer(id uint) error
	UpdatePayer(input *dtos.UpdatePayerInput) (*dtos.Payer, error)
}

type payerService struct {
	logger     *zap.Logger
	repository domain.IPayersRepository
}

func NewPayerService(logger *zap.Logger, repository domain.IPayersRepository) PayerService {
	return &payerService{
		logger:     logger,
		repository: repository,
	}
}

func (s *payerService) GetPayersAsNomenclator() (*dtos.Nomenclators, error) {
	payers, err := s.repository.FindAllPayersAsNomenclator()
	if err != nil {
		return nil, err
	}
	nomenclatures := dtos.Nomenclators(*payers)
	return &nomenclatures, nil
}

func (s *payerService) GetPayers(input *dtos.PayerFilterInput) (*dtos.Payers, error) {
	s.logger.Info("GetPayers", zap.Any("input", input))
	page, size := input.Paginate()
	offset := (page - 1) * size

	sorts := input.GetSorts()

	payers, total, err := s.repository.FindAllPayers(input.Search, &size, &offset, sorts)
	if err != nil {
		return nil, err
	}

	items := utils.Map(*payers, func(payer domain.Payer) dtos.Payer {
		return dtos.Payer{
			Id:                 payer.Id,
			EntityName:         payer.EntityName,
			EntityAddress:      payer.EntityAddress,
			ContactEmail:       payer.ContactEmail,
			ContactName:        payer.ContactName,
			ContactPhoneNumber: payer.ContactPhoneNumber,
			Identifier:         payer.Identifier,
			PaymentTerms:       payer.PaymentTerms,
		}
	})

	result := dtos.Payers{
		Items: items,
		Pagination: dtos.PaginationInfo{
			Page:    page,
			PerPage: size,
			Total:   *total,
		},
	}

	return &result, nil
}

func (s *payerService) CreatePayer(input *dtos.CreatePayerInput) (*dtos.CreatedOutput, error) {
	payer := domain.Payer{
		EntityName:         input.EntityName,
		EntityAddress:      &input.EntityAddress,
		ContactName:        input.ContactName,
		ContactPhoneNumber: &input.ContactPhoneNumber,
		ContactEmail:       input.ContactEmail,
		PaymentTerms:       input.PaymentTerms,
	}
	created, err := s.repository.CreatePayer(&payer)
	if err != nil {
		return nil, err
	}
	result := dtos.CreatedOutput{
		Id: created.Id,
	}
	return &result, nil
}

func (s *payerService) GetPayerById(id uint) (*dtos.Payer, error) {
	payer, err := s.repository.FindPayerByID(id)
	if err != nil {
		return nil, err
	}

	result := dtos.Payer{
		Id:                 payer.Id,
		EntityName:         payer.EntityName,
		EntityAddress:      payer.EntityAddress,
		ContactEmail:       payer.ContactEmail,
		ContactName:        payer.ContactName,
		ContactPhoneNumber: payer.ContactPhoneNumber,
		Identifier:         payer.Identifier,
		PaymentTerms:       payer.PaymentTerms,
	}

	return &result, nil
}

func (s *payerService) DeletePayer(id uint) error {
	err := s.repository.DeletePayer(id)
	if err != nil {
		return err
	}

	return nil
}

func (s *payerService) UpdatePayer(input *dtos.UpdatePayerInput) (*dtos.Payer, error) {
	payer := domain.Payer{
		Id:                 input.Id,
		EntityName:         input.EntityName,
		EntityAddress:      &input.EntityAddress,
		ContactName:        input.ContactName,
		ContactEmail:       input.ContactEmail,
		ContactPhoneNumber: &input.ContactPhoneNumber,
		PaymentTerms:       input.PaymentTerms,
	}

	updated, err := s.repository.UpdatePayer(&payer)
	if err != nil {
		return nil, err
	}

	result := dtos.Payer{
		Id:                 updated.Id,
		EntityName:         updated.EntityName,
		EntityAddress:      updated.EntityAddress,
		ContactName:        updated.ContactName,
		ContactPhoneNumber: updated.ContactPhoneNumber,
		ContactEmail:       updated.ContactEmail,
		PaymentTerms:       updated.PaymentTerms,
	}

	return &result, nil
}
