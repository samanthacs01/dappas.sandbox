package repositories

import (
	"context"
	"errors"
	"fmt"
	"sort"
	"time"

	"github.com/jackc/pgx/v5"
	"go.uber.org/zap"
	"selector.dev/database"
	"selector.dev/database/builders"
	"selector.dev/pulse/config"
	"selector.dev/pulse/internal/domain/payables"
	domain "selector.dev/pulse/internal/domain/receivables"
	"selector.dev/pulse/internal/domain/shared/services"
	"selector.dev/pulse/internal/infrastructure/database/models"
)

type billsRepository struct {
	db      *database.Conn
	config  config.FileManagerConfig
	logger  *zap.Logger
	session services.ISessionServices
}

func NewBillsRepository(db *database.Conn, c config.FileManagerConfig, l *zap.Logger, s services.ISessionServices) payables.IBillsRepository {
	return &billsRepository{
		db:      db,
		config:  c,
		logger:  l,
		session: s,
	}
}

// GetBills implements payables.IBillsRepository.
func (r *billsRepository) GetBills(criteria *payables.BillsListCriteria) (*[]payables.BillListItem, *int64, error) {
	qb := builders.NewSelectQueryBuilder("view_bills b")
	qb.AddFields(
		"b.id",
		"b.identifier",
		"b.production",
		"b.payment_type",
		"b.flight_month",
		"b.amount",
		"b.balance",
		"b.due_date",
		"b.status",
	)

	if len(criteria.Productions) > 0 {
		qb.AnyInt("b.production_id", criteria.Productions)
	}

	if len(criteria.Status) > 0 {
		qb.AnyString("b.status", criteria.Status)
	}

	var counts []models.CountResult

	if err := database.Query(r.db, qb.ToCount(), &counts); err != nil {
		r.logger.Error("error while querying payers", zap.Error(err))
		return nil, nil, err
	}

	if len(counts) == 0 {
		return nil, nil, domain.ErrPayerNotFound
	}
	total := counts[0].Count

	qb.OrderByFields(criteria.GetSort(), mapBillsSortField)
	offset, limit := criteria.Paginate()

	if offset > 0 {
		qb.Skip(offset)
	}
	if limit > 0 {
		qb.Take(limit)
	}

	var items []payables.BillListItem
	if err := database.Query(r.db, qb, &items); err != nil {
		query, args := qb.Build()
		r.logger.Error("error while querying payers", zap.Error(err), zap.Any("query", query), zap.Any("args", args))
		return nil, nil, err
	}
	return &items, &total, nil
}

func (r *billsRepository) RegisterPayment(id int, amount float64) error {
	userId := r.session.GetUserId()
	if userId == nil {
		return errors.New("unauthorized")
	}
	return r.db.UnitOfWork(context.Background(), func(ctx context.Context, tx pgx.Tx) error {
		qb := database.SelectRaw("select payment_bill($1, $2, $3)", []interface{}{id, amount, userId})
		if _, err := database.Exec(ctx, tx, qb, userId); err != nil {
			r.logger.Error("error while registering payment", zap.Error(err))
			return err
		}
		return nil
	})
}

// GetBillsByBillingProduction implements payables.IBillsRepository.
func (r *billsRepository) GetBillsByBillingProduction(criteria *payables.ProductionBillingBillsListCriteria) (*[]payables.ProductionBillingBillListItem, *int64, error) {
	qb := builders.NewSelectQueryBuilder("view_billing_bills b")
	qb.AddFields("b.id", "b.bill_month", "b.revenue", "b.expenses", "b.net_due", "b.balance", "b.due_date", "b.status", "b.b_identifier", "b.production").
		Equal("b.production_id", criteria.Id)

	if len(criteria.Months) > 0 {
		qb.AnyInt("b.month", criteria.Months)
	}
	if len(criteria.Status) > 0 {
		qb.AnyString("b.status", criteria.Status)
	}

	var counts []models.CountResult

	if err := database.Query(r.db, qb.ToCount(), &counts); err != nil {
		r.logger.Error("error while querying payers", zap.Error(err))
		return nil, nil, err
	}

	if len(counts) == 0 {
		return nil, nil, domain.ErrPayerNotFound
	}
	total := counts[0].Count

	qb.OrderByFields(criteria.GetSort(), map[string]string{})
	offset, limit := criteria.Paginate()

	if offset > 0 {
		qb.Skip(offset)
	}
	if limit > 0 {
		qb.Take(limit)
	}

	var items []payables.ProductionBillingBillListItem
	if err := database.Query(r.db, qb, &items); err != nil {
		query, args := qb.Build()
		r.logger.Error("error while querying payers", zap.Error(err), zap.Any("query", query), zap.Any("args", args))
		return nil, nil, err
	}
	return &items, &total, nil
}

// GetBillsByCollectionProduction implements payables.IBillsRepository.
func (r *billsRepository) GetBillsByCollectionProduction(criteria *payables.ProductionCollectionBillsListCriteria) (*[]payables.ProductionCollectionBillListItem, *int64, error) {
	qb := builders.NewSelectQueryBuilder("view_collection_bills b")
	qb.AddFields("b.id", "b.identifier", "b.payer", "b.revenue", "b.due_date", "b.status", "b.b_identifier", "b.production", "b.amount", "b.balance").
		Equal("b.production_id", criteria.Id)

	if len(criteria.Payers) > 0 {
		qb.AnyInt("b.payer_id", criteria.Payers)
	}
	if len(criteria.Status) > 0 {
		qb.AnyString("b.status", criteria.Status)
	}

	if len(criteria.From) > 0 {
		qb.GreaterOrEqualThan("b.d_due_date", criteria.From)
	}

	if len(criteria.To) > 0 {
		qb.LessOrEqualThan("b.d_due_date", criteria.To)
	}

	var counts []models.CountResult

	if err := database.Query(r.db, qb.ToCount(), &counts); err != nil {
		r.logger.Error("error while querying payers", zap.Error(err))
		return nil, nil, err
	}

	if len(counts) == 0 {
		return nil, nil, domain.ErrPayerNotFound
	}
	total := counts[0].Count

	qb.OrderByFields(criteria.GetSort(), mapProductionCollectionBillsSortField)
	offset, limit := criteria.Paginate()

	if offset > 0 {
		qb.Skip(offset)
	}
	if limit > 0 {
		qb.Take(limit)
	}

	var items []payables.ProductionCollectionBillListItem
	if err := database.Query(r.db, qb, &items); err != nil {
		query, args := qb.Build()
		r.logger.Error("error while querying payers", zap.Error(err), zap.Any("query", query), zap.Any("args", args))
		return nil, nil, err
	}
	return &items, &total, nil
}

var mapBillsSortField map[string]string = map[string]string{
	"flight_month": "UPPER(flight_month)",
	"production":   "UPPER(production)",
	"status":       "UPPER(status)",
}

var mapProductionCollectionBillsSortField map[string]string = map[string]string{
	"payer":  "UPPER(payer)",
	"flight": "identifier",
}

func (r *billsRepository) GetPayablesStatsKpi(start, end string) (*payables.PayableStats, error) {
	var stats []payables.PayableStats
	query := fmt.Sprintf("SELECT total_outstanding, total_overdue, on_time_payment_rate, production_payment_on_uncollected_invoices FROM get_payables_kpi('%s'::date, '%s'::date)", start, end)
	args := []interface{}{}
	qb := database.SelectRaw(query, args)

	r.logger.Info("querying payables stats", zap.String("Query", query))

	if err := database.Query(r.db, qb, &stats); err != nil {
		r.logger.Error("error while querying payables stats", zap.Error(err), zap.Any("Args", args), zap.String("Query", query))
		return nil, err
	}
	var zero float64 = 0

	if len(stats) == 0 {
		defaultStats := payables.PayableStats{
			TotalOutstanding:                       &zero,
			TotalOverdue:                           &zero,
			OnTimePaymentRate:                      &zero,
			ProductionPaymentOnUnCollectedInvoices: &zero,
		}
		return &defaultStats, nil
	}
	result := stats[0]
	return &result, nil
}

// GetPayablesStatsKpiDetails implements payables.IBillsRepository.
func (r *billsRepository) GetPayablesStatsKpiDetails(statType string, start string, end string) ([]payables.PayablesKpiDetailsItem, error) {
	query := queryByStatsType(statType)
	args := []interface{}{start, end}
	r.logger.Info("querying receivables stats", zap.String("Query", query), zap.Any("Args", args))
	qb := database.SelectRaw(query, args)
	var items []payables.PayablesKpiDetailsItem
	if err := database.Query(r.db, qb, &items); err != nil {
		r.logger.Error("error while querying receivables stats", zap.Error(err))
		return items, err
	}
	if items == nil {
		items = []payables.PayablesKpiDetailsItem{}
	}
	return items, nil
}

func (r *billsRepository) GetPayablesStackStatsKpiDetails(statType, start, end string) ([]map[string]interface{}, error) {
	result := make([]map[string]interface{}, 0)

	query := queryByStackStatsType(statType)
	if len(query) == 0 {
		return result, errors.New("invalid type")
	}
	args := []interface{}{start, end}
	r.logger.Info("querying receivables stats", zap.String("Query", query), zap.Any("Args", args))
	qb := database.SelectRaw(query, args)
	var items []struct {
		Grouping, GroupingDetails string
		Total                     *float64
		ToOrder                   time.Time
	}
	if err := database.Query(r.db, qb, &items); err != nil {
		r.logger.Error("error while querying receivables stats", zap.Error(err))
		return result, err
	}
	rawResult := map[time.Time]map[string]interface{}{}
	for _, item := range items {
		rawResult[item.ToOrder] = map[string]interface{}{}
	}
	r.logger.Warn("Results", zap.Any("Results", rawResult))
	for _, item := range items {
		var total float64 = 0
		if item.Total != nil {
			total = *item.Total
		}
		if _, ok := rawResult[item.ToOrder][item.GroupingDetails]; !ok {
			rawResult[item.ToOrder][item.GroupingDetails] = map[string]interface{}{
				"name":        item.GroupingDetails,
				item.Grouping: total,
			}
		} else {
			rawResult[item.ToOrder][item.GroupingDetails].(map[string]interface{})[item.Grouping] = total
		}
	}

	keys := make([]time.Time, 0, len(rawResult))

	for k := range rawResult {
		keys = append(keys, k)
	}
	r.logger.Warn("Result", zap.Any("Result", rawResult), zap.Any("Keys", keys))
	sort.Slice(keys, func(i, j int) bool {
		if statType == "payables_overdue_bills" {
			return keys[i].After(keys[j])
		}
		return keys[i].Before(keys[j])
	})

	for _, k := range keys {
		for _, v := range rawResult[k] {
			result = append(result, v.(map[string]interface{}))
		}
	}
	return result, nil
}

func queryByStatsType(statType string) string {
	fmt.Println(statType)
	switch statType {
	case "payables_outstanding_productions":
		return "SELECT DISTINCT grouping, grouping_details, total FROM get_payables_outstanding_productions($1::date, $2::date)"
	case "payables_outstanding_dates":
		return "SELECT DISTINCT grouping, grouping_details, total FROM get_payables_outstanding_dates($1::date, $2::date)"
	case "paid_uncollected_payment_productions":
		return "SELECT DISTINCT grouping, grouping_details, total FROM get_payables_paid_uncollected_payment_productions($1::date, $2::date)"
	case "paid_uncollected_payment_dates":
		return "SELECT DISTINCT grouping, grouping_details, total FROM get_payables_paid_uncollected_payment_dates($1::date, $2::date)"
	default:
		return ""
	}
}

func queryByStackStatsType(statType string) string {
	fmt.Println(statType)
	switch statType {
	case "payables_on_time_rate":
		return "SELECT DISTINCT grouping, grouping_details, total, \"order\" FROM get_payables_on_time_payment_rate_dates($1::date, $2::date)"
	case "payables_overdue_bills":
		return "SELECT DISTINCT grouping, grouping_details, total, \"order\" FROM get_payables_overdue_bills($1::date, $2::date)"
	default:
		return ""
	}
}
