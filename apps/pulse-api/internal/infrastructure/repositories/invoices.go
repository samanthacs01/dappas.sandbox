package repositories

import (
	"context"
	"errors"
	"fmt"
	"sort"
	"strconv"
	"strings"

	"github.com/jackc/pgx/v5"
	"go.uber.org/zap"
	"selector.dev/database"
	"selector.dev/database/builders"
	"selector.dev/pulse/config"
	"selector.dev/pulse/internal/domain/receivables"
	"selector.dev/pulse/internal/domain/shared/services"
	"selector.dev/pulse/internal/infrastructure/database/models"
	"selector.dev/utils"
)

type invoicesRepository struct {
	db      *database.Conn
	config  config.FileManagerConfig
	logger  *zap.Logger
	session services.ISessionServices
}

func NewInvoicesRepository(db *database.Conn, c config.FileManagerConfig, l *zap.Logger, s services.ISessionServices) receivables.IInvoicesRepository {
	return &invoicesRepository{
		db:      db,
		config:  c,
		logger:  l,
		session: s,
	}
}

func (r *invoicesRepository) GeneratedInvoices(flights []int) (*[]receivables.DraftInvoice, error) {
	userId := r.session.GetUserId()
	if userId == nil {
		return nil, errors.New("unauthorized")
	}
	_flightIdStr := utils.Map(flights, func(f int) string { return strconv.Itoa(f) })
	_flightIds := strings.Join(_flightIdStr, ",")
	var items []receivables.DraftInvoice

	qb := database.SelectRaw(fmt.Sprintf("select invoice_id, payer, amount, payment_terms, to_char(due_date, 'MM/DD/YY') as due_date FROM generate_invoice('{%s}'::int[], $1)", _flightIds), []interface{}{userId})
	if err := database.Query(r.db, qb, &items); err != nil {
		r.logger.Error("Error while generating invoice", zap.Error(err))
		return nil, err
	}
	return &items, nil
}

func (r *invoicesRepository) AcceptGeneratedBills(ids []int) error {
	userId := r.session.GetUserId()
	if userId == nil {
		return errors.New("unauthorized")
	}
	return r.db.UnitOfWork(context.Background(), func(ctx context.Context, tx pgx.Tx) error {

		_flightIdStr := utils.Map(ids, func(f int) string { return strconv.Itoa(f) })
		_flightIds := strings.Join(_flightIdStr, ",")

		qb := database.SelectRaw(fmt.Sprintf("select accept_invoice('{%s}'::int[], '%s', $1)", _flightIds, receivables.InvoiceStatusPendingPayment), []interface{}{userId})
		if err := database.ExecWithoutContext(r.db, qb); err != nil {
			r.logger.Error("Error while generating invoice", zap.Error(err))
			return err
		}
		return nil
	})
}

func (r *invoicesRepository) FindAllInvoices(criteria receivables.InvoiceListFilter) (*[]receivables.InvoiceListItem, *int64, error) {
	items := make([]receivables.InvoiceListItem, 0)
	fields := []string{
		"i.id",
		"i.identifier",
		"i.payer",
		"i.productions",
		"i.bills",
		"i.advertisers",
		"i.amount_to_pay",
		"i.balance",
		"i.payment_terms",
		"to_char(i.invoiced_date, 'MM/DD/YYYY') as invoiced_date",
		"to_char(i.due_date, 'MM/DD/YYYY') as due_date",
		"i.status",
	}
	qb := builders.NewSelectQueryBuilder("view_invoices i")
	qb.AddFields(fields...)
	qb.Distinct()

	if len(criteria.Payers) > 0 {
		qb.AnyInt("i.payer_id", criteria.Payers)
	}
	if len(criteria.Productions) > 0 {
		_ids := strings.Join(utils.Map(criteria.Productions, func(p int) string { return strconv.Itoa(p) }), ",")
		qb.RawCondition("i.productions_ids && ARRAY[" + _ids + "]")
	}
	if len(criteria.Status) > 0 {
		qb.AnyString("i.status", criteria.Status)
	} else {
		qb.NotEqual("i.status", receivables.InvoiceStatusDraft)
	}
	if criteria.Search != nil && len(*criteria.Search) > 0 {
		qb.Like("i.identifier || ';' || i.payer || ';'|| array_to_string(i.productions, ';')", *criteria.Search)
	}

	from, to := criteria.DateFilter()

	if len(from) > 0 || len(to) > 0 {
		field := "i.invoiced_date"
		if len(from) > 0 && len(to) > 0 {
			qb.Between(field, criteria.From, criteria.To)
		} else if len(from) > 0 {
			qb.GreaterOrEqualThan(field, criteria.From)
		} else {
			qb.LessOrEqualThan(field, criteria.To)
		}
	}

	var counts []models.CountResult
	if err := database.Query(r.db, qb.ToCount(), &counts); err != nil {
		query, args := qb.ToCount().Build()
		r.logger.Error("Error while querying invoices", zap.Error(err), zap.Any("query", query), zap.Any("args", args))
		return nil, nil, err
	}

	// Sorts list
	qb.OrderByFields(criteria.GetSorts(), mapInvoiceSortField)

	total := counts[0].Count
	offset, limit := criteria.OffsetLimit()
	r.logger.Info("Total invoices", zap.Int("offset", offset), zap.Int("limit", limit))
	if limit > 0 {
		qb.Take(limit)
	}
	if offset > 0 {
		qb.Skip(offset)
	}

	query, args := qb.Build()
	r.logger.Info("QUERY", zap.Any("query", query), zap.Any("args", args))

	if err := database.Query(r.db, qb, &items); err != nil {
		query, args := qb.Build()
		r.logger.Error("Error while querying invoices", zap.Error(err), zap.Any("query", query), zap.Any("args", args))
		return nil, nil, err
	}

	return &items, &total, nil
}

func (r *invoicesRepository) RegisterPayment(id int, amount float64) error {
	userId := r.session.GetUserId()
	if userId == nil {
		return errors.New("unauthorized")
	}
	return r.db.UnitOfWork(context.Background(), func(ctx context.Context, tx pgx.Tx) error {
		qb := database.SelectRaw("select payment_invoice($1, $2, $3)", []interface{}{id, amount, userId})
		if _, err := database.Exec(ctx, tx, qb, userId); err != nil {
			r.logger.Error("Error while registering payment", zap.Error(err))
			return err
		}
		return nil
	})
}

var mapInvoiceSortField map[string]string = map[string]string{
	"payer":        "payer",
	"invoice_date": "\"invoiced_date\"",
	"due_date":     "\"due_date\"",
}

func (r *invoicesRepository) GetReceivableStatsKpi(start, end string) (*receivables.ReceivableStats, error) {
	var stats []receivables.ReceivableStats
	query := fmt.Sprintf("SELECT total_outstanding, total_overdue, collection_rate, collection_with_payment_terms,customer_concentration FROM get_receivables_kpi('%s'::date, '%s'::date)", start, end)
	args := []interface{}{}
	qb := database.SelectRaw(query, args)

	r.logger.Info("Querying receivables stats", zap.String("Query", query))

	if err := database.Query(r.db, qb, &stats); err != nil {
		r.logger.Error("Error while querying receivables stats", zap.Error(err), zap.Any("Args", args), zap.String("Query", query))
		return nil, err
	}
	var zero float64 = 0

	if len(stats) == 0 {
		defaultStats := receivables.ReceivableStats{
			TotalOutstanding:           &zero,
			TotalOverdue:               &zero,
			CollectionRate:             &zero,
			CollectionWithPaymentTerms: &zero,
			CustomerConcentration:      &zero,
		}
		return &defaultStats, nil
	}
	result := stats[0]

	return &result, nil
}

func (r *invoicesRepository) GetTotalOutstandingValues(start, end string) (*[]receivables.ReceivableKpiDetailsItem, error) {
	var items []receivables.ReceivableKpiDetailsItem
	query := `SELECT p.identifier as grouping, p.entity_name as grouping_details, SUM(balance) as total FROM invoices i join payers p on i.payer_id  = p.id 
			  WHERE invoiced_date BETWEEN $1::date AND $2::date AND status=ANY(ARRAY[$3, $4]) GROUP BY p.identifier, p.entity_name;`
	args := []interface{}{start, end, receivables.InvoiceStatusPendingPayment, receivables.InvoiceStatusPartialPaid}
	qb := database.SelectRaw(query, args)

	r.logger.Info("Querying collection rate values", zap.String("Query", query))

	if err := database.Query(r.db, qb, &items); err != nil {
		r.logger.Error("Error while querying collection rate values", zap.Error(err), zap.Any("Args", args), zap.String("Query", query))
		return nil, err
	}
	return &items, nil
}

func (r *invoicesRepository) GetCollectionRateValues(start, end string) (*[]receivables.ReceivableKpiDetailsItem, error) {
	var items []receivables.ReceivableKpiDetailsItem
	query := "SELECT grouping, grouping_details, total FROM get_receivables_collect_rate_overall($1, $2);"
	args := []interface{}{start, end}
	qb := database.SelectRaw(query, args)

	r.logger.Info("Querying collection rate values", zap.String("Query", query))

	if err := database.Query(r.db, qb, &items); err != nil {
		r.logger.Error("Error while querying collection rate values", zap.Error(err), zap.Any("Args", args), zap.String("Query", query))
		return nil, err
	}
	return &items, nil
}

func (r *invoicesRepository) GetCollectionWithPaymentTermsValues(start, end string) (*[]receivables.ReceivableKpiDetailsItem, error) {
	var items []receivables.ReceivableKpiDetailsItem
	query := "SELECT grouping, grouping_details, total FROM get_collection_with_payment_terms($1, $2)"
	args := []interface{}{start, end}
	qb := database.SelectRaw(query, args)

	r.logger.Info("Querying collection rate values", zap.String("Query", query))

	if err := database.Query(r.db, qb, &items); err != nil {
		r.logger.Error("Error while querying collection rate values", zap.Error(err), zap.Any("Args", args), zap.String("Query", query))
		return nil, err
	}
	return &items, nil
}

func (r *invoicesRepository) GetCustomerConcentrationValues(start, end string) (*[]receivables.ReceivableKpiDetailsItem, error) {
	var items []receivables.ReceivableKpiDetailsItem
	query := `with customers_concentration as (
			select SUM(amount) as total FROM invoices WHERE invoiced_date BETWEEN $1 AND $2 AND status = ANY(array[$3,$4,$5])
		),
		top5_payers as (
			select i.payer_id, sum(i.amount) as total_amount from invoices i where i.invoiced_date BETWEEN $1 AND $2 and i.status =ANY(array[$3,$4,$5])  group by i.payer_id order by total_amount desc limit 5
		),
		sum_top5_payers as (
			select sum(total_amount) as total_amount from top5_payers
		),
		items as (
			select p.identifier as grouping, p.entity_name as grouping_details, t5.total_amount as it_total from payers p inner join top5_payers t5 on p.id = t5.payer_id
				union all 
			select 'Others' as grouping, 'Others' as grouping_details, cc.total - t5.total_amount as it_total FROM sum_top5_payers t5, customers_concentration cc
		)
		select it.grouping, it.grouping_details, case when t.total is null or t.total =0 then 0 else (it.it_total/t.total *100)::numeric(10,2) end as total from items it, customers_concentration t`
	args := []interface{}{start, end, receivables.InvoiceStatusPaid, receivables.InvoiceStatusPendingPayment, receivables.InvoiceStatusPartialPaid}
	qb := database.SelectRaw(query, args)

	r.logger.Info("Querying collection rate values", zap.String("Query", query))

	if err := database.Query(r.db, qb, &items); err != nil {
		r.logger.Error("Error while querying collection rate values", zap.Error(err), zap.Any("Args", args), zap.String("Query", query))
		return nil, err
	}
	return &items, nil
}

func (r *invoicesRepository) GetTotalOverdueValues(start, end string) (*[]map[string]interface{}, error) {
	var items []struct {
		Name  string
		Payer string
		Total *float64
		Order int
	}

	args := []interface{}{start, end, getFormatFromDate(start)}
	qb := database.SelectRaw(receivablesOverdueValuesQuery, args)

	if err := database.Query(r.db, qb, &items); err != nil {
		r.logger.Error("Error while querying collection rate values", zap.Error(err), zap.Any("Args", args), zap.String("Query", receivablesOverdueValuesQuery))
		return nil, err
	}

	_result := map[int]map[string]interface{}{}
	for _, item := range items {
		_result[item.Order] = map[string]interface{}{}
	}
	r.logger.Warn("Results", zap.Any("Results", _result))
	for _, item := range items {
		var total float64 = 0
		if item.Total != nil {
			total = *item.Total
		}
		if _, ok := _result[item.Order][item.Name]; !ok {
			_result[item.Order][item.Name] = map[string]interface{}{
				"name":     item.Name,
				item.Payer: total,
			}
		} else {
			_result[item.Order][item.Name].(map[string]interface{})[item.Payer] = total
		}
	}

	keys := make([]int, 0, len(_result))

	for k := range _result {
		keys = append(keys, k)
	}
	r.logger.Warn("Result", zap.Any("Result", _result), zap.Any("Keys", keys))
	sort.Ints(keys)
	result := make([]map[string]interface{}, 0)
	for _, k := range keys {
		for _, v := range _result[k] {
			result = append(result, v.(map[string]interface{}))
		}
	}
	return &result, nil
}
