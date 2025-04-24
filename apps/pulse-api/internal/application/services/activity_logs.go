package services

import (
	"go.uber.org/zap"
	"selector.dev/pulse/internal/application/dtos"
	"selector.dev/pulse/internal/domain/activity_logs"
)

type IActivityLogService interface {
	FindAll(input *dtos.ActivityLogInput) (*dtos.ActivityLogs, error)
}

type activityLogService struct {
	logger     *zap.Logger
	repository activity_logs.IActivityLogRepository
}

func NewActivityLogService(l *zap.Logger, r activity_logs.IActivityLogRepository) IActivityLogService {
	return &activityLogService{
		logger:     l,
		repository: r,
	}
}

func (a *activityLogService) FindAll(input *dtos.ActivityLogInput) (*dtos.ActivityLogs, error) {
	page, size := input.Paginate()

	criteria := activity_logs.ActivityLogCriteria{
		Actors:      input.Actors.LiteralValues(),
		Entities:    input.Entities.LiteralValues(),
		EntitiesIds: input.EntitiesIds.Values(),
		Actions:     input.Actions.LiteralValues(),
		From:        input.From,
		To:          input.To,
		Sort:        input.Sort.Values(),
		Page:        &page,
		Size:        &size,
	}
	items, count, err := a.repository.FindAll(input.Search, &criteria)
	if err != nil {
		return nil, err
	}
	result := dtos.ActivityLogs{
		Items: *items,
		Pagination: dtos.PaginationInfo{
			Total:   *count,
			Page:    page,
			PerPage: size,
		},
	}
	return &result, nil
}
