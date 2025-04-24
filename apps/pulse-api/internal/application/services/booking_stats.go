package services

import (
	"go.uber.org/zap"
	"selector.dev/pulse/internal/application/dtos"
	"selector.dev/pulse/internal/domain/booking"
)

type IBookingStatsServices interface {
	GetKpiByDateRange(from, to string) (*booking.BookingStats, error)
	GetBookingValueDetails(input *dtos.RangeDateInput) (*[]booking.BookingKpiDetailsItem, error)
	GetBookingFulfillmentRateDetails(input *dtos.RangeDateInput) (*[]booking.BookingKpiDetailsItem, error)
	GetBookingPayersConcentrationDetails(input *dtos.RangeDateInput) (*[]booking.BookingKpiDetailsItem, error)
	GetBookingProductionsConcentrationDetails(input *dtos.RangeDateInput) (*[]booking.BookingKpiDetailsItem, error)
}

type bookingStatsService struct {
	repository booking.IBookingRepository
	logger     *zap.Logger
}

func NewBookingStatsService(r booking.IBookingRepository, l *zap.Logger) IBookingStatsServices {
	return &bookingStatsService{
		repository: r,
		logger:     l,
	}
}

func (b *bookingStatsService) GetKpiByDateRange(from, to string) (*booking.BookingStats, error) {
	return b.repository.GetBookingStatsKpi(from, to)
}

func (b *bookingStatsService) GetBookingValueDetails(input *dtos.RangeDateInput) (*[]booking.BookingKpiDetailsItem, error) {
	return b.repository.GetBookingValueDetails(input.From, input.To)
}

func (b *bookingStatsService) GetBookingFulfillmentRateDetails(input *dtos.RangeDateInput) (*[]booking.BookingKpiDetailsItem, error) {
	return b.repository.GetBookingFulfillmentRateDetails(input.From, input.To)
}

func (b *bookingStatsService) GetBookingPayersConcentrationDetails(input *dtos.RangeDateInput) (*[]booking.BookingKpiDetailsItem, error) {
	return b.repository.GetBookingPayersConcentrationDetails(input.From, input.To)
}

func (b *bookingStatsService) GetBookingProductionsConcentrationDetails(input *dtos.RangeDateInput) (*[]booking.BookingKpiDetailsItem, error) {
	return b.repository.GetBookingProductionsConcentrationDetails(input.From, input.To)
}
