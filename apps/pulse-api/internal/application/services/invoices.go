package services

import (
	"go.uber.org/zap"
	"selector.dev/pulse/internal/application/dtos"
	domain "selector.dev/pulse/internal/domain/booking"
	"selector.dev/pulse/internal/domain/receivables"
)

//go:generate mockery --name=IInvoicesService --output=../../../tests/mocks --filename=invoices_service.go
type IInvoicesService interface {
	GenerateBills(input *dtos.GenerateBillsInput) (*[]receivables.DraftInvoice, error)
	GetInvoices(input *dtos.ListWithFilterInput) (*dtos.Invoices, error)
	AcceptGeneratedBills(input *dtos.AcceptGeneratedBillingInput) error
	RegisterPayment(input *dtos.RegisterPaymentInput) error
	GetKpiByDateRange(from, to string) (*receivables.ReceivableStats, error)
	GetTotalOutstandingValues(start, end string) (*[]receivables.ReceivableKpiDetailsItem, error)
	GetCollectionRateValues(start, end string) (*[]receivables.ReceivableKpiDetailsItem, error)
	GetCollectionWithPaymentTermsValues(start, end string) (*[]receivables.ReceivableKpiDetailsItem, error)
	GetCustomerConcentrationValues(start, end string) (*[]receivables.ReceivableKpiDetailsItem, error)
	GetTotalOverdueValues(start, end string) (*[]map[string]interface{}, error)
}

type invoiceService struct {
	repository         domain.IBookingRepository
	invoicesRepository receivables.IInvoicesRepository
	logger             *zap.Logger
}

func NewInvoicesService(r domain.IBookingRepository, l *zap.Logger, ir receivables.IInvoicesRepository) IInvoicesService {
	return &invoiceService{
		repository:         r,
		logger:             l,
		invoicesRepository: ir,
	}
}

func (b *invoiceService) GetKpiByDateRange(from, to string) (*receivables.ReceivableStats, error) {
	return b.invoicesRepository.GetReceivableStatsKpi(from, to)
}

func (s *invoiceService) GenerateBills(input *dtos.GenerateBillsInput) (*[]receivables.DraftInvoice, error) {
	items, err := s.repository.FetchOrdersAndFlights(input.Flights)
	s.logger.Info("Orders and flights fetched", zap.Any("items", items))
	if err != nil {
		return nil, err
	}
	return s.invoicesRepository.GeneratedInvoices(input.Flights)
}

func (s *invoiceService) GetInvoices(input *dtos.ListWithFilterInput) (*dtos.Invoices, error) {
	s.logger.Info("Fetching invoices", zap.Any("input", input))
	offset, limit := input.OffsetLimit()
	criteria := receivables.InvoiceListFilter{
		Search:      input.Search,
		Productions: input.Productions.Values(),
		Payers:      input.Payers.Values(),
		Sort:        input.Sorts.Values(),
		Status:      input.Status.Values(),
		Offset:      offset,
		Limit:       limit,
		From:        input.From,
		To:          input.To,
	}
	invoices, total, err := s.invoicesRepository.FindAllInvoices(criteria)
	if err != nil {
		return nil, err
	}
	s.logger.Info("Invoices fetched", zap.Any("invoices", invoices))
	page, size := input.Paginate()
	result := dtos.Invoices{
		Items: *invoices,
		Pagination: dtos.PaginationInfo{
			Page:    page,
			PerPage: size,
			Total:   *total,
		},
	}
	return &result, nil
}

func (s *invoiceService) AcceptGeneratedBills(input *dtos.AcceptGeneratedBillingInput) error {
	return s.invoicesRepository.AcceptGeneratedBills(input.Invoices)
}

func (s *invoiceService) RegisterPayment(input *dtos.RegisterPaymentInput) error {
	return s.invoicesRepository.RegisterPayment(input.Id, input.Amount)
}

func (s *invoiceService) GetTotalOutstandingValues(start, end string) (*[]receivables.ReceivableKpiDetailsItem, error) {
	return s.invoicesRepository.GetTotalOutstandingValues(start, end)
}

func (s *invoiceService) GetCollectionRateValues(start, end string) (*[]receivables.ReceivableKpiDetailsItem, error) {
	return s.invoicesRepository.GetCollectionRateValues(start, end)
}

func (s *invoiceService) GetCollectionWithPaymentTermsValues(start, end string) (*[]receivables.ReceivableKpiDetailsItem, error) {
	return s.invoicesRepository.GetCollectionWithPaymentTermsValues(start, end)
}

func (s *invoiceService) GetCustomerConcentrationValues(start, end string) (*[]receivables.ReceivableKpiDetailsItem, error) {
	return s.invoicesRepository.GetCustomerConcentrationValues(start, end)
}

func (s *invoiceService) GetTotalOverdueValues(start, end string) (*[]map[string]interface{}, error) {
	return s.invoicesRepository.GetTotalOverdueValues(start, end)
}
