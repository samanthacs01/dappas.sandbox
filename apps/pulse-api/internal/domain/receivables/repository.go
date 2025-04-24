package receivables

import (
	"selector.dev/pulse/internal/domain/shared"
)

//go:generate mockery --name=IPayersRepository --output=../../../tests/mocks --filename=receivables_payers_repository.go
type IPayersRepository interface {
	FindPayerByID(id uint) (*Payer, error)
	FindAllPayersAsNomenclator() (*[]shared.Nomenclator, error)
	FindAllPayers(search *string, limit *int, offset *int, sorts []struct{ Field, Direction string }) (*[]Payer, *int64, error)
	CreatePayer(payer *Payer) (*Payer, error)
	DeletePayer(id uint) error
	UpdatePayer(payer *Payer) (*Payer, error)
}

//go:generate mockery --name=IInvoicesRepository --output=../../../tests/mocks --filename=receivables_invoices_repository.go
type IInvoicesRepository interface {
	GeneratedInvoices(flights []int) (*[]DraftInvoice, error)
	AcceptGeneratedBills(ids []int) error
	FindAllInvoices(criteria InvoiceListFilter) (*[]InvoiceListItem, *int64, error)
	RegisterPayment(id int, amount float64) error
	GetReceivableStatsKpi(start, end string) (*ReceivableStats, error)
	GetTotalOutstandingValues(start, end string) (*[]ReceivableKpiDetailsItem, error)
	GetCollectionRateValues(start, end string) (*[]ReceivableKpiDetailsItem, error)
	GetCollectionWithPaymentTermsValues(start, end string) (*[]ReceivableKpiDetailsItem, error)
	GetCustomerConcentrationValues(start, end string) (*[]ReceivableKpiDetailsItem, error)
	GetTotalOverdueValues(start, end string) (*[]map[string]interface{}, error)
}
