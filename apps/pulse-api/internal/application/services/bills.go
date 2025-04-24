package services

import (
	"go.uber.org/zap"
	"selector.dev/pulse/internal/application/dtos"
	"selector.dev/pulse/internal/domain/payables"
)

type IBillsService interface {
	GetBills(input *dtos.BillsListInput) (*dtos.Bills, error)
	RegisterPayment(input *dtos.RegisterPaymentInput) error
	GetProductionBillingBills(input *dtos.ProductionBillingBillsInput) (*dtos.ProductionBillingBills, error)
	GetProductionCollectionBills(input *dtos.ProductionCollectionBillsInput) (*dtos.ProductionCollectionBills, error)
}

type billsService struct {
	logger     *zap.Logger
	repository payables.IBillsRepository
}

func NewBillsService(l *zap.Logger, r payables.IBillsRepository) IBillsService {
	return &billsService{
		logger:     l,
		repository: r,
	}
}

func (b *billsService) GetBills(input *dtos.BillsListInput) (*dtos.Bills, error) {
	page, size := input.Paginate()
	criteria := payables.BillsListCriteria{
		Productions: input.Productions.Values(),
		Status:      input.Status.Values(),
		Sort:        input.Sort.Values(),
		Page:        &page,
		Size:        &size,
	}
	items, count, err := b.repository.GetBills(&criteria)
	if err != nil {
		return nil, err
	}
	result := dtos.Bills{
		Items: *items,
		Pagination: dtos.PaginationInfo{
			Total:   *count,
			Page:    page,
			PerPage: size,
		},
	}
	return &result, nil
}

func (s *billsService) RegisterPayment(input *dtos.RegisterPaymentInput) error {
	return s.repository.RegisterPayment(input.Id, input.Amount)
}

// GetProductionBillingBills implements IBillsService.
func (b *billsService) GetProductionBillingBills(input *dtos.ProductionBillingBillsInput) (*dtos.ProductionBillingBills, error) {
	page, size := input.Paginate()
	criteria := payables.ProductionBillingBillsListCriteria{
		Id:     int(*input.ProductionId),
		Months: input.Months.Values(),
		Status: input.Status.Values(),
		Sort:   input.Sort.Values(),
		Page:   &page,
		Size:   &size,
	}
	items, count, err := b.repository.GetBillsByBillingProduction(&criteria)
	if err != nil {
		return nil, err
	}
	result := dtos.ProductionBillingBills{
		Items: *items,
		Pagination: dtos.PaginationInfo{
			Total:   *count,
			Page:    page,
			PerPage: size,
		},
	}
	return &result, nil
}

// GetProductionCollectionBills implements IBillsService.
func (b *billsService) GetProductionCollectionBills(input *dtos.ProductionCollectionBillsInput) (*dtos.ProductionCollectionBills, error) {
	page, size := input.Paginate()
	criteria := payables.ProductionCollectionBillsListCriteria{
		Id:     int(*input.ProductionId),
		Payers: input.Payers.Values(),
		Status: input.Status.Values(),
		Sort:   input.Sort.Values(),
		From:   input.From,
		To:     input.To,
		Page:   &page,
		Size:   &size,
	}
	items, count, err := b.repository.GetBillsByCollectionProduction(&criteria)
	if err != nil {
		return nil, err
	}
	result := dtos.ProductionCollectionBills{
		Items: *items,
		Pagination: dtos.PaginationInfo{
			Total:   *count,
			Page:    page,
			PerPage: size,
		},
	}
	return &result, nil
}
