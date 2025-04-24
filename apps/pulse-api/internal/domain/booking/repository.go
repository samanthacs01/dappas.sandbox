package booking

import "selector.dev/pulse/internal/domain/shared"

//go:generate mockery --name=IBookingRepository --output=../../../tests/mocks --filename=booking_booking_repository.go
type IBookingRepository interface {
	GetInsertionOrders(criteria InsertionOrderListFilter) (*[]InsertionOrderListItem, *int64, error)
	GetFlights(criteria FlightListFilter) (*[]FlightListItem, *int64, error)
	GetIoDrafts(criteria IoDraftListFilter) (*[]IoDraftListItem, *int64, error)
	GetIoDraftToProcess(process int) (*[]DraftToProcess, error)
	GetFileProcessingStatus() (*ProcessingStatus, error)
	SaveDrafts(drafts []IoDraft) error
	GetDraftById(id int) (*IoDraftDetails, error)
	UpdateDraftStatus(id int, status IoDraftStatus) error
	UpdateDraftAfterProcessed(draft IoDraft, flights []IoDraftFlight) error
	ReviewedDraft(reviewedDraft ReviewedDraftInput) error
	DeleteDraft(id int) error
	UpdateBatchDraftStatus(ids []int, status IoDraftStatus) error
	GetBookingStatsKpi(start, end string) (*BookingStats, error)
	FetchOrdersAndFlights(flights []int) (*[]OrderWithFlights, error)
	GetBookingValueDetails(from string, to string) (*[]BookingKpiDetailsItem, error)
	GetBookingFulfillmentRateDetails(from string, to string) (*[]BookingKpiDetailsItem, error)
	GetBookingPayersConcentrationDetails(from string, to string) (*[]BookingKpiDetailsItem, error)
	GetBookingProductionsConcentrationDetails(from string, to string) (*[]BookingKpiDetailsItem, error)
}

//go:generate mockery --name=IAdvertisersRepository --output=../../../tests/mocks --filename=booking_advertisers_repository.go
type IAdvertisersRepository interface {
	GetItemsAsNomenclator() (*[]shared.Nomenclator, error)
}
