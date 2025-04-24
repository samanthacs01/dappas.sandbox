package repositories

import (
	"fmt"
	"time"

	"go.uber.org/zap"
	"selector.dev/database"
	"selector.dev/database/builders"
	"selector.dev/pulse/config"
	"selector.dev/pulse/internal/domain/activity_logs"
	domain "selector.dev/pulse/internal/domain/receivables"
	"selector.dev/pulse/internal/infrastructure/database/models"
)

type activityLogRepository struct {
	db     *database.Conn
	config config.FileManagerConfig
	logger *zap.Logger
}

func NewActivityLogRepository(db *database.Conn, c config.FileManagerConfig, l *zap.Logger) activity_logs.IActivityLogRepository {
	return &activityLogRepository{
		db:     db,
		config: c,
		logger: l,
	}
}

// FindAll implements activity_logs.IActivityLogRepository.
func (r *activityLogRepository) FindAll(search *string, criteria *activity_logs.ActivityLogCriteria) (*[]activity_logs.ActivityLogItem, *int64, error) {
	qb := builders.NewSelectQueryBuilder("view_activity_logs l")
	qb.AddFields(
		"l.id",
		"l.action_at",
		"l.own_by",
		"l.entity",
		"l.entity_id",
		"l.action",
		"l.action_data",
	)

	if search != nil && *search != "" {
		qb.Like("search_field", *search)
	}
	if criteria != nil {

		if len(*criteria.From) > 0 {
			qb.GreaterOrEqualThan("l.action_at", criteria.From)
		}

		if len(*criteria.To) > 0 {
			var toDate, err = time.Parse("2006-01-02", *criteria.To)
			if err != nil {
				return nil, nil, fmt.Errorf("invalid 'to' date format")
			}
			toDate = toDate.Add(23*time.Hour + 59*time.Minute + 59*time.Second)
			qb.LessOrEqualThan("l.action_at", toDate.Format("2006-01-02 15:04:05"))
		}

		if len(criteria.Actions) > 0 {
			qb.AnyString("action", criteria.Actions)
		}

		if len(criteria.Entities) > 0 {
			qb.AnyString("entity", criteria.Entities)
		}

		if len(criteria.EntitiesIds) > 0 {
			qb.AnyInt("entity_id", criteria.EntitiesIds)
		}

		if len(criteria.Actors) > 0 {
			qb.AnyString("own_by", criteria.Actors)
		}
	}

	var counts []models.CountResult

	if err := database.Query(r.db, qb.ToCount(), &counts); err != nil {
		r.logger.Error("Error while querying logs", zap.Error(err))
		return nil, nil, err
	}

	if len(counts) == 0 {
		return nil, nil, domain.ErrPayerNotFound
	}

	total := counts[0].Count

	qb.OrderByFields(criteria.Sort, mapActivitySortField)

	var size int
	if criteria.Size != nil {
		size = *criteria.Size
		qb.Take(size)
	}
	if criteria.Page != nil {
		offset := size * (*criteria.Page - 1)
		qb.Skip(offset)
	}

	var items []activity_logs.ActivityLogItem
	if err := database.Query(r.db, qb, &items); err != nil {
		query, args := qb.Build()
		r.logger.Error("Error while querying activity logs", zap.Error(err), zap.Any("Query", query), zap.Any("Args", args))
		return nil, nil, err
	}

	return &items, &total, nil
}
