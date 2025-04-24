package payables

import (
	"selector.dev/pulse/internal/domain/shared"
)

//go:generate mockery --name=IProductionsRepository --output=../../../tests/mocks --filename=payables_production_repository.go
type IProductionsRepository interface {
	FindProductionByID(id uint) (*Production, error)
	FindAllProductions(search *string, limit *int, offset *int, sorts []struct{ Field, Direction string }) (*[]ProductionListItem, *int64, error)
	FindAllProductionsAsNomenclator() (*[]shared.Nomenclator, error)
	CreateProduction(production *Production) (*Production, error)
	DeleteProductionByID(id uint) error
	UpdateProduction(id uint, updateData *ProductionUpdateData) error
	GetProductionStatsKpi(id uint, start, end string) (ProductionStats, error)
	GetProductionDetailsStatsKpiDetails(id uint, statType, start, end string) ([]PayablesKpiDetailsItem, error)
}

//go:generate mockery --name=IBillsRepository --output=../../../tests/mocks --filename=payables_bill_repository.go
type IBillsRepository interface {
	GetBills(criteria *BillsListCriteria) (*[]BillListItem, *int64, error)
	RegisterPayment(id int, amount float64) error
	GetBillsByBillingProduction(criteria *ProductionBillingBillsListCriteria) (*[]ProductionBillingBillListItem, *int64, error)
	GetBillsByCollectionProduction(criteria *ProductionCollectionBillsListCriteria) (*[]ProductionCollectionBillListItem, *int64, error)
	GetPayablesStatsKpi(start, end string) (*PayableStats, error)
	GetPayablesStatsKpiDetails(statType, start, end string) ([]PayablesKpiDetailsItem, error)
	GetPayablesStackStatsKpiDetails(statType, start, end string) ([]map[string]interface{}, error)
}
