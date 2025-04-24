package repositories

import (
	"errors"
	"fmt"
	"sort"
	"time"

	"go.uber.org/zap"
	"selector.dev/database"
	"selector.dev/pulse/config"
	"selector.dev/pulse/internal/domain/overview"
	"selector.dev/pulse/internal/domain/shared/services"
)

type overviewRepository struct {
	db      *database.Conn
	config  config.FileManagerConfig
	logger  *zap.Logger
	session services.ISessionServices
}

func NewOverviewRepository(db *database.Conn, c config.FileManagerConfig, l *zap.Logger, s services.ISessionServices) overview.IOverviewRepository {
	return &overviewRepository{
		db:      db,
		config:  c,
		logger:  l,
		session: s,
	}
}

func (r *overviewRepository) GetOverviewStatsKpi(start, end string) (*overview.OverviewStats, error) {
	var stats []overview.OverviewStats
	query := "select revenue, gross_margin, dso, dpo from get_overview_summary(TO_DATE($1, $2), TO_DATE($3, $4))"
	args := []interface{}{start, getFormatFromDate(start), end, getFormatFromDate(end)}
	qb := database.SelectRaw(query, args)

	r.logger.Info(logMessage("overview"), zap.String("Query", query))

	if err := database.Query(r.db, qb, &stats); err != nil {
		r.logger.Error(logErrorMessage("overview"), zap.Error(err), zap.Any("Args", args), zap.String("Query", query))
		return nil, err
	}
	var zero float64 = 0

	if len(stats) == 0 {
		defaultStats := overview.OverviewStats{
			TotalRevenue: &zero,
			GrossMargin:  &zero,
			Dso:          &zero,
			Dpo:          &zero,
		}
		return &defaultStats, nil
	}
	result := stats[0]
	return &result, nil
}

func logMessage(statType string) string {
	return fmt.Sprintf("Querying %s stats", statType)
}
func logErrorMessage(statType string) string {
	return fmt.Sprintf("Error while querying %s stats", statType)
}

// GetPayablesStatsKpiDetails implements payables.IBillsRepository.
func (r *overviewRepository) GetOverviewStatsKpiDetails(statType string, start string, end string) ([]overview.OverviewKpiDetailsItem, error) {
	query := queryOverviewByStatsType(statType)
	args := []interface{}{start, getFormatFromDate(start), end, getFormatFromDate(end)}
	r.logger.Info(logMessage(statType), zap.String("Query", query), zap.Any("Args", args))
	qb := database.SelectRaw(query, args)
	var items []overview.OverviewKpiDetailsItem
	if err := database.Query(r.db, qb, &items); err != nil {
		r.logger.Error(logErrorMessage(statType), zap.Error(err))
		return items, err
	}
	if items == nil {
		items = []overview.OverviewKpiDetailsItem{}
	}
	return items, nil
}

func (r *overviewRepository) GetOverviewStatsKpiDetailsWithCompose(statType string, start string, end string) ([]overview.OverviewKpiDetailsItemWithComposeValue, error) {
	query := queryOverviewByStatsWithComposeValueType(statType)
	args := []interface{}{start, getFormatFromDate(start), end, getFormatFromDate(end)}
	r.logger.Info(fmt.Sprintf(logMessage(statType), statType), zap.String("Query", query), zap.Any("Args", args))
	qb := database.SelectRaw(query, args)
	var items []overview.OverviewKpiDetailsItemWithComposeValue
	if err := database.Query(r.db, qb, &items); err != nil {
		r.logger.Error(logErrorMessage(statType), zap.Error(err))
		return items, err
	}
	if items == nil {
		items = []overview.OverviewKpiDetailsItemWithComposeValue{}
	}
	return items, nil
}

func (r *overviewRepository) GetOverviewStackStatsKpiDetails(statType, start, end string) ([]map[string]interface{}, error) {
	result := make([]map[string]interface{}, 0)

	query := queryOverviewByStackStatsType(statType)
	if len(query) == 0 {
		return result, errors.New("invalid type")
	}
	args := []interface{}{start, getFormatFromDate(start), end, getFormatFromDate(end)}
	r.logger.Info(fmt.Sprintf(logMessage(statType), statType), zap.String("Query", query), zap.Any("Args", args))
	qb := database.SelectRaw(query, args)
	var items []struct {
		Grouping, GroupingDetails string
		Total                     *float64
		Order                     time.Time
	}
	if err := database.Query(r.db, qb, &items); err != nil {
		r.logger.Error(logErrorMessage(statType), zap.Error(err))
		return result, err
	}
	rawResult := map[time.Time]map[string]interface{}{}
	for _, item := range items {
		rawResult[item.Order] = map[string]interface{}{}
	}
	r.logger.Warn("Results", zap.Any("Results", rawResult))
	for _, item := range items {
		var total float64 = 0
		if item.Total != nil {
			total = *item.Total
		}
		if _, ok := rawResult[item.Order][item.GroupingDetails]; !ok {
			rawResult[item.Order][item.GroupingDetails] = map[string]interface{}{
				"name":        item.GroupingDetails,
				item.Grouping: total,
			}
		} else {
			rawResult[item.Order][item.GroupingDetails].(map[string]interface{})[item.Grouping] = total
		}
	}

	keys := make([]time.Time, 0, len(rawResult))

	for k := range rawResult {
		keys = append(keys, k)
	}
	r.logger.Warn("Result", zap.Any("Result", rawResult), zap.Any("Keys", keys))
	sort.Slice(keys, func(i, j int) bool {
		return keys[i].Before(keys[j])
	})
	r.logger.Warn("Sorted Keys", zap.Any("Keys", keys))

	for _, k := range keys {
		for _, v := range rawResult[k] {
			result = append(result, v.(map[string]interface{}))
		}
	}
	return result, nil
}

func queryOverviewByStatsType(statType string) string {
	fmt.Println(statType)
	switch statType {
	case "overview_total_revenue":
		return "SELECT grouping, grouping_details, total FROM get_net_income_details(TO_DATE($1, $2), TO_DATE($3,$4))"
	default:
		return ""
	}
}

func queryOverviewByStatsWithComposeValueType(statType string) string {
	fmt.Println(statType)
	switch statType {
	case "dso":
		return "SELECT grouping, grouping_details, total, compose FROM get_overview_general_dso_details(TO_DATE($1, $2), TO_DATE($3,$4))"
	case "dpo":
		return "SELECT grouping, grouping_details, total, compose FROM get_overview_general_dpo_details(TO_DATE($1, $2), TO_DATE($3,$4))"
	default:
		return ""
	}
}

func queryOverviewByStackStatsType(statType string) string {
	fmt.Println(statType)
	switch statType {
	case "gross_margin":
		return "SELECT grouping, grouping_details, total, \"order\" FROM get_overview_general_gross_margin_details(TO_DATE($1, $2), TO_DATE($3,$4))"
	default:
		return ""
	}
}
