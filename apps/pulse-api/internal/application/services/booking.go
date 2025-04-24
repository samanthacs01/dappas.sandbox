package services

import (
	"go.uber.org/zap"
	"selector.dev/pulse/internal/application/dtos"
	domain "selector.dev/pulse/internal/domain/booking"
	servicesShared "selector.dev/pulse/internal/domain/shared/services"
	"selector.dev/utils"
)

type IBookingService interface {
	GetInsertionOrders(input *dtos.InsertionOrderFilterInput) (*dtos.InsertionOrders, error)
	GetFlights(input *dtos.FlightFilterInput) (*dtos.Flights, error)
	GetIoDrafts(input *dtos.IoDraftFilterInput) (*dtos.IoDrafts, error)
	GetFileProcessingStatus() (*domain.ProcessingStatus, error)
	UploadOrders(input *dtos.UploadOrdersInput) error
	GetDraftById(id int) (*domain.IoDraftDetails, error)
	ReviewedDraft(input *domain.ReviewedDraftInput) error
	DeleteDraft(id int) error
	GetIoDraftsAmountPendingToReview() (*dtos.IoDraftsAmountPendingToReview, error)
}

type bookingService struct {
	repository   domain.IBookingRepository
	fileUploader servicesShared.IFilesUploader
	logger       *zap.Logger
}

func NewBookingService(r domain.IBookingRepository, fu servicesShared.IFilesUploader, l *zap.Logger) IBookingService {
	return &bookingService{
		repository:   r,
		logger:       l,
		fileUploader: fu,
	}
}

func (s *bookingService) GetInsertionOrders(input *dtos.InsertionOrderFilterInput) (*dtos.InsertionOrders, error) {
	status := input.Status.Values()
	payers := input.Payers.Values()
	productions := input.Productions.Values()
	page, size := input.Paginate()
	criteria := domain.InsertionOrderListFilter{
		Search:      input.Search,
		Status:      &status,
		Payers:      &payers,
		Productions: &productions,
		Sorts:       input.Sorts.Values(),
		From:        input.From,
		To:          input.To,
		Size:        &size,
		Page:        &page,
	}
	items, total, err := s.repository.GetInsertionOrders(criteria)
	if err != nil {
		return nil, err
	}

	result := &dtos.InsertionOrders{
		Items: *items,
		Pagination: dtos.PaginationInfo{
			Page:    page,
			PerPage: size,
			Total:   *total,
		},
	}
	return result, nil
}

func (s *bookingService) GetFlights(input *dtos.FlightFilterInput) (*dtos.Flights, error) {
	status := input.Status.Values()
	payers := input.Payers.Values()
	productions := input.Productions.Values()
	advertisers := input.Advertisers.Values()
	sorts := input.Sorts.Values()
	page, size := input.Paginate()
	criteria := domain.FlightListFilter{
		Status:      &status,
		Sorts:       sorts,
		Payers:      &payers,
		Productions: &productions,
		Advertisers: &advertisers,
		From:        input.From,
		To:          input.To,
		Size:        &size,
		Page:        &page,
	}
	items, total, err := s.repository.GetFlights(criteria)
	if err != nil {
		return nil, err
	}

	result := &dtos.Flights{
		Items: *items,
		Pagination: dtos.PaginationInfo{
			Page:    page,
			PerPage: size,
			Total:   *total,
		},
	}
	return result, nil
}

func (s *bookingService) GetIoDrafts(input *dtos.IoDraftFilterInput) (*dtos.IoDrafts, error) {
	status := input.Status.Values()
	sorts := input.Sorts.Values()
	page, size := input.Paginate()
	criteria := domain.IoDraftListFilter{
		Status: &status,
		Sorts:  sorts,
		Page:   &page,
		Size:   &size,
	}
	items, total, err := s.repository.GetIoDrafts(criteria)
	if err != nil {
		return nil, err
	}

	result := &dtos.IoDrafts{
		Items: *items,
		Pagination: dtos.PaginationInfo{
			Page:    page,
			PerPage: size,
			Total:   *total,
		},
	}
	return result, nil
}

func (s *bookingService) GetFileProcessingStatus() (*domain.ProcessingStatus, error) {
	return s.repository.GetFileProcessingStatus()
}

func (s *bookingService) UploadOrders(input *dtos.UploadOrdersInput) error {
	if err := input.Validate(); err != nil {
		return err
	}
	paths, err := s.fileUploader.UploadFiles(servicesShared.InsertionOrders, input.Files)
	if err != nil {
		return err
	}
	s.logger.Info("Files uploaded", zap.Any("paths", paths))
	drafts := utils.Map(*paths, func(p servicesShared.UploadedFile) domain.IoDraft {
		return domain.IoDraft{
			Filename: p.FileName,
			Filepath: p.FilePath,
			Status:   domain.IoDraftStatusUploaded,
		}
	})
	return s.repository.SaveDrafts(drafts)
}

func (s *bookingService) GetDraftById(id int) (*domain.IoDraftDetails, error) {
	return s.repository.GetDraftById(id)
}

func (s *bookingService) ReviewedDraft(input *domain.ReviewedDraftInput) error {
	if input == nil {
		return domain.ErrDraftNotFound
	}
	return s.repository.ReviewedDraft(*input)
}

func (s *bookingService) DeleteDraft(id int) error {
	draft, err := s.repository.GetDraftById(id)
	if err != nil {
		return err
	}
	if draft.Status == domain.IoDraftStatusReviewed {
		return domain.ErrDraftCannotBeDeleted
	}
	return s.repository.DeleteDraft(id)
}

func (s *bookingService) GetIoDraftsAmountPendingToReview() (*dtos.IoDraftsAmountPendingToReview, error) {

	criteria := domain.IoDraftListFilter{
		Status: &[]string{string(domain.IoDraftStatusPendingToReview)},
	}
	_, total, err := s.repository.GetIoDrafts(criteria)
	if err != nil {
		return nil, err
	}

	result := &dtos.IoDraftsAmountPendingToReview{
		Amount: *total,
	}
	return result, nil
}
