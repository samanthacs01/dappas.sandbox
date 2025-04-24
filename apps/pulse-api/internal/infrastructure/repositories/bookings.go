package repositories

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
	"go.uber.org/zap"
	"selector.dev/database"
	"selector.dev/database/builders"
	"selector.dev/pulse/config"
	domain "selector.dev/pulse/internal/domain/booking"
	"selector.dev/pulse/internal/domain/receivables"
	"selector.dev/pulse/internal/domain/shared/services"
	"selector.dev/pulse/internal/infrastructure/database/models"
	"selector.dev/utils"
)

type bookingsRepository struct {
	db      *database.Conn
	config  config.FileManagerConfig
	logger  *zap.Logger
	session services.ISessionServices
}

func NewBookingsRepository(db *database.Conn, l *zap.Logger, s services.ISessionServices, config config.FileManagerConfig) domain.IBookingRepository {
	return &bookingsRepository{
		db:      db,
		config:  config,
		logger:  l,
		session: s,
	}
}

func (r *bookingsRepository) GetInsertionOrders(criteria domain.InsertionOrderListFilter) (*[]domain.InsertionOrderListItem, *int64, error) {
	var items []models.ViewInsertionOrder
	fields := []string{
		"i.id",
		"i.payer",
		"i.number",
		"i.medias",
		"i.signed_date",
		"i.advertisers",
		"i.total_io_impressions",
		"i.net_total_io_cost",
		"i.gross_total_io_cost",
		"i.status",
		"UPPER(i.status) AS upper_status",
		"UPPER(i.payer) AS upper_payer",
	}
	qb := builders.NewSelectQueryBuilder("view_insertion_orders i")
	qb.AddFields(fields...)

	if criteria.Status != nil && len(*criteria.Status) > 0 {
		qb.InString("status", *criteria.Status)
	}
	if criteria.Payers != nil && len(*criteria.Payers) > 0 {
		qb.InInt("payer_id", *criteria.Payers)
	}
	if criteria.Productions != nil && len(*criteria.Productions) > 0 {
		inItems := strings.Trim(strings.Join(strings.Fields(fmt.Sprint(*criteria.Productions)), ","), "[]")
		qb.InnerJoin("flights", fmt.Sprintf("flights.insertion_order_id = i.id AND flights.production_id IN (%s)", inItems))
		qb.Distinct()
	}

	var fromDate, toDate time.Time
	var err error

	if criteria.From != nil && *criteria.From != "" {
		fromDate, err = time.Parse("2006-01-02", *criteria.From)
		if err != nil {
			return nil, nil, fmt.Errorf("invalid 'from' date format")
		}
		qb.GreaterOrEqualThan("created_at", fromDate.Format("2006-01-02"))
	}

	if criteria.To != nil && *criteria.To != "" {
		toDate, err = time.Parse("2006-01-02", *criteria.To)
		if err != nil {
			return nil, nil, fmt.Errorf("invalid 'to' date format")
		}
		toDate = toDate.Add(23*time.Hour + 59*time.Minute + 59*time.Second)
		qb.LessOrEqualThan("created_at", toDate.Format("2006-01-02 15:04:05"))
	}

	if criteria.From != nil && *criteria.From != "" && criteria.To != nil && *criteria.To != "" {
		if fromDate.After(toDate) {
			return nil, nil, fmt.Errorf("'from' date cannot be after 'to' date")
		}
	}

	if criteria.Search != nil && *criteria.Search != "" {
		qb.Like("search", *criteria.Search)
	}

	var counts []models.CountResult
	countQuery, countArgs := qb.Build()
	r.logger.Info("Querying insertion orders count", zap.String("Query", countQuery), zap.Any("Args", countArgs))
	if err := database.Query(r.db, qb.ToCount(), &counts); err != nil {
		query, args := qb.Build()
		r.logger.Error("Error while querying count of insertion orders", zap.Error(err), zap.String("Query", query), zap.Any("Args", args))
		return nil, nil, err
	}

	if len(counts) == 0 {
		zero := int64(0)
		return &[]domain.InsertionOrderListItem{}, &zero, nil
	}

	total := counts[0].Count

	// Sorts list
	qb.OrderByFields(criteria.GetSorts(), mapInsertionOrderSortField)

	var size int
	if criteria.Size != nil {
		size = *criteria.Size
		qb.Take(size)
	}
	if criteria.Page != nil {
		offset := size * (*criteria.Page - 1)
		qb.Skip(offset)
	}

	if err := database.Query(r.db, qb, &items); err != nil {
		query, args := qb.Build()
		r.logger.Error("Error while querying insertion orders", zap.Error(err), zap.String("Query", query), zap.Any("Args", args))
		return nil, nil, err
	}

	insertionOrders := utils.Map(items, func(m models.ViewInsertionOrder) domain.InsertionOrderListItem {
		return domain.InsertionOrderListItem{
			Id:          m.Id,
			Number:      m.Number,
			PayerName:   m.Payer,
			SignedDate:  m.SignedDate,
			Medias:      m.Medias,
			Advertisers: m.Advertisers,
			Impressions: m.Impressions,
			Cost:        m.NetCost,
			Status:      domain.InsertionOrderStatus(m.Status),
		}
	})

	return &insertionOrders, &total, nil
}

func (r *bookingsRepository) GetFlights(criteria domain.FlightListFilter) (*[]domain.FlightListItem, *int64, error) {
	var items []models.ViewFlight

	fields := []string{
		"i.id",
		"i.identifier",
		"i.insertion_order",
		"i.payer",
		"i.advertiser",
		"i.media",
		"i.production",
		"i.total_cost",
		"i.drop_dates",
		"i.status",
		"i.impressions",
		"UPPER(i.status) AS upper_status",
		"UPPER(i.payer) AS upper_payer",
		"UPPER(i.advertiser) AS upper_advertiser",
		"UPPER(i.production) AS upper_production",
		"UPPER(i.media) AS upper_media",
	}
	qb := builders.NewSelectQueryBuilder("view_flights i")
	qb.AddFields(fields...)

	if criteria.Status != nil && len(*criteria.Status) > 0 {
		qb.InString("status", *criteria.Status)
	}

	if criteria.Productions != nil && len(*criteria.Productions) > 0 {
		qb.InInt("production_id", *criteria.Productions)
	}

	if criteria.Payers != nil && len(*criteria.Payers) > 0 {
		qb.InInt("payer_id", *criteria.Payers)
	}

	if criteria.Advertisers != nil && len(*criteria.Advertisers) > 0 {
		qb.AnyString("MD5(advertiser)", *criteria.Advertisers)
	}

	if (criteria.From != nil && *criteria.From != "") || (criteria.To != nil && *criteria.To != "") {
		var rangeConditions []string
		var specificConditions []string

		if criteria.From != nil && *criteria.From != "" {
			if _, err := time.Parse("2006-01-02", *criteria.From); err != nil {
				return nil, nil, fmt.Errorf("invalid 'from' date format")
			}
			rangeConditions = append(rangeConditions, fmt.Sprintf("end_date >= '%s'", *criteria.From))
			specificConditions = append(specificConditions, fmt.Sprintf("init_date >= '%s'", *criteria.From))

		}

		if criteria.To != nil && *criteria.To != "" {
			if _, err := time.Parse("2006-01-02", *criteria.To); err != nil {
				return nil, nil, fmt.Errorf("invalid 'to' date format")
			}
			rangeConditions = append(rangeConditions, fmt.Sprintf("init_date <= '%s'", *criteria.To))
			specificConditions = append(specificConditions, fmt.Sprintf("init_date <= '%s'", *criteria.To))
		}

		var joinConditions string
		if criteria.From != nil && *criteria.From != "" && criteria.To != nil && *criteria.To != "" {
			joinConditions = fmt.Sprintf(
				"flight_dates.flight_id = i.id AND ((flight_dates.value_type = '%s' AND init_date <= '%s' AND end_date >= '%s') OR (flight_dates.value_type = '%s' AND init_date >= '%s' AND init_date <= '%s'))",
				domain.FlightDateTypeRange, *criteria.To, *criteria.From,
				domain.FlightDateTypeSpecific, *criteria.From, *criteria.To,
			)
		} else if criteria.From != nil && *criteria.From != "" {
			joinConditions = fmt.Sprintf(
				"flight_dates.flight_id = i.id AND ((flight_dates.value_type = '%s' AND %s) OR (flight_dates.value_type = '%s' AND %s))",
				domain.FlightDateTypeRange,
				strings.Join(rangeConditions, " AND "),
				domain.FlightDateTypeSpecific,
				strings.Join(specificConditions, " AND "),
			)
		} else if criteria.To != nil && *criteria.To != "" {
			joinConditions = fmt.Sprintf(
				"flight_dates.flight_id = i.id AND ((flight_dates.value_type = '%s' AND %s) OR (flight_dates.value_type = '%s' AND %s))",
				domain.FlightDateTypeRange,
				strings.Join(rangeConditions, " AND "),
				domain.FlightDateTypeSpecific,
				strings.Join(specificConditions, " AND "),
			)
		}

		if joinConditions != "" {
			qb.InnerJoin("flight_dates", joinConditions)
			qb.Distinct()
		}
	}

	var counts []models.CountResult
	if err := database.Query(r.db, qb.ToCount(), &counts); err != nil {
		query, args := qb.Build()
		r.logger.Error("Error while querying flight counts", zap.Error(err), zap.String("Query", query), zap.Any("Args", args))
		return nil, nil, err
	}

	if len(counts) == 0 {
		zero := int64(0)
		return &[]domain.FlightListItem{}, &zero, nil
	}

	total := counts[0].Count
	// Sorts list
	qb.OrderByFields(criteria.GetSorts(), mapFlightSortField)

	var size int
	if criteria.Size != nil {
		size = *criteria.Size
		qb.Take(size)
	}
	if criteria.Page != nil {
		offset := size * (*criteria.Page - 1)
		qb.Skip(offset)
	}

	if err := database.Query(r.db, qb, &items); err != nil {
		query, args := qb.Build()
		r.logger.Error("Error while querying flights", zap.Error(err), zap.String("QUERY", query), zap.Any("Args", args))
		return nil, nil, err
	}

	flights := mapViewFlightToFlightListItem(items)

	return &flights, &total, nil
}

func (r *bookingsRepository) GetIoDrafts(criteria domain.IoDraftListFilter) (*[]domain.IoDraftListItem, *int64, error) {
	var items []models.ViewIoDraftList
	qb := database.Select(models.ViewIoDraftList{})

	if criteria.Status != nil && len(*criteria.Status) > 0 {
		qb.InString("status", *criteria.Status)
	}
	var counts []models.CountResult

	if err := database.Query(r.db, qb.ToCount(), &counts); err != nil {
		query, args := qb.Build()
		r.logger.Error("Error while querying insertion orders", zap.Error(err), zap.String("Query", query), zap.Any("Args", args))
		return nil, nil, err
	}

	// Sorts list
	qb.OrderByFields(criteria.GetSorts(), mapDraftSortField)

	total := counts[0].Count
	var size int
	if criteria.Size != nil {
		size = *criteria.Size
		qb.Take(size)
	}
	if criteria.Page != nil {
		offset := size * (*criteria.Page - 1)
		qb.Skip(offset)
	}
	if err := database.Query(r.db, qb, &items); err != nil {
		query, args := qb.Build()
		r.logger.Error("Error while querying drafts", zap.Error(err), zap.Any("Query", query), zap.Any("Args", args))
		return nil, nil, err
	}

	ioDrafts := utils.Map(items, func(m models.ViewIoDraftList) domain.IoDraftListItem {
		return m.ToItemList()
	})

	return &ioDrafts, &total, nil
}

func (r *bookingsRepository) GetFileProcessingStatus() (*domain.ProcessingStatus, error) {
	qb := database.Select(models.ViewIoDraftList{})

	var total, processed int64 = 0, 0
	qb.NotEqual("status", domain.IoDraftStatusPendingToReview)
	qb.NotEqual("status", domain.IoDraftStatusFailed)
	var countsTotal []models.CountResult
	if err := database.Query(r.db, qb.ToCount(), &countsTotal); err != nil {
		query, args := qb.Build()
		r.logger.Error("Error while querying insertion orders", zap.Error(err), zap.String("Query", query), zap.Any("Args", args))
		return nil, err
	}

	total = countsTotal[0].Count

	qb.NotEqual("status", domain.IoDraftStatusUploaded)

	var countsProcessed []models.CountResult
	if err := database.Query(r.db, qb.ToCount(), &countsProcessed); err != nil {
		query, args := qb.Build()
		r.logger.Error("Error while querying insertion orders", zap.Error(err), zap.String("Query", query), zap.Any("Args", args))
		return nil, err
	}

	processed = countsProcessed[0].Count

	result := &domain.ProcessingStatus{
		Total:     int(total),
		Processed: int(processed),
	}
	return result, nil
}

func (r *bookingsRepository) SaveDrafts(drafts []domain.IoDraft) error {
	userId := r.session.GetUserId()
	changeBy := r.changeBy()
	return r.db.UnitOfWork(context.Background(), func(ctx context.Context, tx pgx.Tx) error {
		for _, draft := range drafts {
			draft.ChangeBy = &changeBy
			qb := database.InsertInto(draft)
			var result []models.CreatedResult
			if err := database.Save(ctx, tx, qb, &result, userId); err != nil {
				return err
			}
			r.logger.Info("Draft saved", zap.Any("draft", draft), zap.Any("result", result))
		}
		return nil
	})
}

func (r *bookingsRepository) GetDraftById(id int) (*domain.IoDraftDetails, error) {
	var draft []domain.IoDraft
	qb := database.Select(domain.IoDraft{})
	qb.Equal("id", id)
	if err := database.Query(r.db, qb, &draft); err != nil {
		return nil, err
	}
	if len(draft) == 0 {
		return nil, domain.ErrDraftNotFound
	}
	var flights []models.ViewIoFlightList
	qb = database.Select(models.ViewIoFlightList{})
	qb.Equal("io_draft_id", id)
	if err := database.Query(r.db, qb, &flights); err != nil {
		return nil, err
	}
	flightItems := utils.Map(flights, func(m models.ViewIoFlightList) domain.DraftFlightListItem {
		return domain.DraftFlightListItem{
			Id:              m.Id,
			Identifier:      m.Identifier,
			ProductionId:    m.ProductionId,
			Length:          m.Length,
			TotalCost:       m.TotalCost,
			DropDates:       m.DropDates,
			Production:      m.Production,
			PromoCode:       m.PromoCode,
			Media:           m.Media,
			LivePrerecorded: m.LivePrerecorded,
			Host:            m.Host,
			AdsType:         m.AdsType,
			Spots:           m.Spots,
			Cpm:             m.Cpm,
			Advertiser:      m.Advertiser,
			Impressions:     m.Impressions,
			Placement:       m.Placement,
		}
	})
	var item = domain.IoDraftDetails{
		Id:       draft[0].Id,
		Filepath: r.config.GetRealPath(draft[0].Filepath),
		Status:   domain.IoDraftStatus(draft[0].Status),
		ExtractedData: domain.IoDraftExtractedData{
			Number:            draft[0].Number,
			PayerId:           draft[0].PayerId,
			NetCost:           draft[0].NetCost,
			Impressions:       draft[0].Impressions,
			GrossCost:         draft[0].GrossCost,
			Payer:             draft[0].Payer,
			NetCostCurrency:   draft[0].NetCostCurrency,
			GrossCostCurrency: draft[0].GrossCostCurrency,
			SignedDate:        draft[0].SignedDate,
		},
		Flights: flightItems,
	}
	return &item, nil
}

func (r *bookingsRepository) UpdateDraftStatus(id int, status domain.IoDraftStatus) error {
	userId := r.session.GetUserId()
	return r.db.UnitOfWork(context.Background(), func(ctx context.Context, tx pgx.Tx) error {

		qb := database.Update(domain.IoDraft{})
		qb.Equal("id", id)
		qb.Set("status", status)
		qb.Set("change_by", r.changeBy())

		if _, err := database.Exec(ctx, tx, qb, userId); err != nil {
			return err
		}
		return nil
	})
}

func (r *bookingsRepository) UpdateBatchDraftStatus(ids []int, status domain.IoDraftStatus) error {
	userId := r.session.GetUserId()
	return r.db.UnitOfWork(context.Background(), func(ctx context.Context, tx pgx.Tx) error {
		qb := database.Update(domain.IoDraft{})
		qb.InInt("id", ids)
		qb.Set("status", status)
		qb.Set("change_by", r.changeBy())
		if _, err := database.Exec(ctx, tx, qb, userId); err != nil {
			return err
		}
		return nil
	})
}

func (r *bookingsRepository) UpdateDraftAfterProcessed(draft domain.IoDraft, flights []domain.IoDraftFlight) error {
	userId := r.session.GetUserId()
	return r.db.UnitOfWork(context.Background(), func(ctx context.Context, tx pgx.Tx) error {
		_changeBy := r.changeBy()
		qb := database.Update(domain.IoDraft{})
		qb.Equal("id", draft.Id)
		qb.Set("status", domain.IoDraftStatusPendingToReview)
		qb.Set("io_number", draft.Number)
		qb.Set("io_payer_id", draft.PayerId)
		qb.Set("io_net_total_io_cost", draft.NetCost)
		qb.Set("io_total_io_impressions", draft.Impressions)
		qb.Set("io_gross_total_io_cost", draft.GrossCost)
		qb.Set("advertiser", draft.Advertiser)
		qb.Set("payer", draft.Payer)
		qb.Set("payer_id", draft.PayerId)
		qb.Set("signed_at", draft.SignedDate)
		qb.Set("io_gross_total_io_cost_currency", draft.GrossCostCurrency)
		qb.Set("io_net_total_io_cost_currency", draft.NetCostCurrency)
		qb.Set("creator", draft.Creator)
		qb.Set("change_by", _changeBy)

		if _, err := database.Exec(ctx, tx, qb, userId); err != nil {
			r.logger.Error("Error while updating draft", zap.Error(err))
			return err
		}

		for _, flight := range flights {
			flight.ChangeBy = &_changeBy
			qb := database.InsertInto(flight)

			var result []models.CreatedResult
			if err := database.Save(ctx, tx, qb, &result, userId); err != nil {
				r.logger.Error("Error while insert flight", zap.Error(err))
				return err
			}

			r.logger.Info("Flight saved", zap.Any("flight", flight), zap.Any("result", result))
		}

		return nil
	})
}

func (r *bookingsRepository) ReviewedDraft(draftReviewed domain.ReviewedDraftInput) error {
	userId := r.session.GetUserId()
	_changeBy := r.changeBy()
	return r.db.UnitOfWork(context.Background(), func(ctx context.Context, tx pgx.Tx) error {
		selectQb := database.Select(receivables.Payer{})
		selectQb.Equal("id", draftReviewed.PayerId)
		var payers []receivables.Payer
		if err := database.Query(r.db, selectQb, &payers); err != nil {
			r.logger.Error("Error while querying payer", zap.Error(err))
			return err
		}
		if len(payers) == 0 {
			r.logger.Error("No payer found for given payer_id", zap.Int("payer_id", draftReviewed.PayerId))
			return errors.New("payer not found")
		}
		payer := payers[0]

		qb := database.Update(domain.IoDraft{})
		qb.Equal("id", draftReviewed.DraftId)
		qb.Set("status", domain.IoDraftStatusReviewed)
		qb.Set("payer_id", draftReviewed.PayerId)
		qb.Set("change_by", _changeBy)

		if _, err := database.Exec(ctx, tx, qb, userId); err != nil {
			r.logger.Error("Error while updating draft", zap.Error(err))
			return err
		}
		_next := payer.LastIONumber + 1
		number := generateInsertionOrderNumber(payer.Identifier, _next)
		io := mapIoDraftToIo(draftReviewed, number, &_changeBy)
		qbSave := database.InsertInto(io)
		var result []models.CreatedResult
		if err := database.Save(ctx, tx, qbSave, &result, userId); err != nil {
			r.logger.Error("Error while insert io", zap.Error(err))
			return err
		}
		r.logger.Info("IO saved", zap.Any("io", io), zap.Any("result", result))
		ioId := int(result[0].ID)
		//ioFlights := make([]domain.Flight, 0)
		for _, flight := range draftReviewed.Flights {
			qb := database.Update(domain.IoDraftFlight{})
			qb.Equal("id", flight.DraftId)
			qb.Set("production_id", flight.ProductionId)
			qb.Set("change_by", _changeBy)
			if _, err := database.Exec(ctx, tx, qb, userId); err != nil {
				r.logger.Error("Error while updating draft", zap.Error(err))
				return err
			}
			r.logger.Info("Flight saved", zap.Any("flight", flight))

			qbCreate := mapIoDraftFlightToFlight(flight, ioId, &_changeBy)
			var result []models.CreatedResult
			if err := database.Save(ctx, tx, qbCreate, &result, userId); err != nil {
				r.logger.Error("Error while insert flight", zap.Error(err))
				return err
			}
		}

		// Update payer last io number
		qb = database.Update(receivables.Payer{})
		qb.Equal("id", payer.Id)
		qb.Set("io_last_generated", _next)
		if _, err := database.Exec(ctx, tx, qb, userId); err != nil {
			r.logger.Error("Error while updating payer", zap.Error(err))
			return err
		}

		return nil
	})
}

func (r *bookingsRepository) DeleteDraft(id int) error {
	userId := r.session.GetUserId()
	return r.db.UnitOfWork(context.Background(), func(ctx context.Context, tx pgx.Tx) error {
		qb := database.SoftDeleteFrom(domain.IoDraft{})
		qb.Equal("id", id)
		qb.Set("change_by", r.changeBy())
		affected, err := database.Exec(ctx, tx, qb, userId)
		if affected == nil || *affected == 0 {
			return domain.ErrDraftNotFound
		}
		return err
	})
}

func (r *bookingsRepository) GetBookingStatsKpi(start, end string) (*domain.BookingStats, error) {
	var stats []domain.BookingStats
	query := fmt.Sprintf("SELECT total_booked, fulfillment_rate, top5_payers_rate as concentration_payer, top5_production_rate as concentration_production FROM get_booking_kpi('%s'::date, '%s'::date)", start, end)
	args := []interface{}{}
	qb := database.SelectRaw(query, args)

	r.logger.Info("Querying booking stats", zap.String("Query", query))

	if err := database.Query(r.db, qb, &stats); err != nil {
		r.logger.Error("Error while querying booking stats", zap.Error(err), zap.Any("Args", args), zap.String("Query", query))
		return nil, err
	}
	var zero float32 = 0

	if len(stats) == 0 {
		defaultStats := domain.BookingStats{
			TotalInsertionOrders:    &zero,
			BookingFulfillmentRate:  &zero,
			CustomerConcentration:   &zero,
			ProductionConcentration: &zero,
		}
		return &defaultStats, nil
	}
	result := domain.BookingStats{
		TotalInsertionOrders:    getValueOrDefault(stats[0].TotalInsertionOrders, &zero),
		BookingFulfillmentRate:  getValueOrDefault(stats[0].BookingFulfillmentRate, &zero),
		CustomerConcentration:   getValueOrDefault(stats[0].CustomerConcentration, &zero),
		ProductionConcentration: getValueOrDefault(stats[0].ProductionConcentration, &zero),
	}

	return &result, nil
}

func (r *bookingsRepository) FetchOrdersAndFlights(flights []int) (*[]domain.OrderWithFlights, error) {
	args := []interface{}{flights}
	qb := database.SelectRaw("SELECT id FROM flights WHERE deleted_at is null and status = 'invoiced' and id = ANY($1)", args)

	var invoicedFlights []struct{ Id int }

	if err := database.Query(r.db, qb, &invoicedFlights); err != nil {
		return nil, err
	}

	if len(invoicedFlights) > 0 {
		return nil, domain.ErrFlightsAlreadyInvoiced
	}

	qb = database.SelectRaw("SELECT distinct f.insertion_order_id as id, ARRAY_AGG(f.id) OVER(PARTITION BY f.insertion_order_id) as flights FROM flights f WHERE f.id = ANY($1) ORDER BY f.insertion_order_id ", args)

	var items []domain.OrderWithFlights

	if err := database.Query(r.db, qb, &items); err != nil {
		return nil, err
	}

	return &items, nil
}

func (r *bookingsRepository) GetBookingValueDetails(from string, to string) (*[]domain.BookingKpiDetailsItem, error) {
	query := "SELECT grouping, total FROM get_booking_values(TO_DATE($1, $3), TO_DATE($2, $3))"

	qb := builders.NewSelectRawQueryBuilder(query, []interface{}{from, to, getFormatFromDate(from)})
	var items []domain.BookingKpiDetailsItem

	if err := database.Query(r.db, qb, &items); err != nil {
		return nil, err
	}
	return &items, nil
}

func (r *bookingsRepository) GetBookingFulfillmentRateDetails(from string, to string) (*[]domain.BookingKpiDetailsItem, error) {
	query := fmt.Sprintf("select grouping, total from get_booking_fulfillment_rate(TO_DATE($1, '%s'), TO_DATE($2, '%s'))", getFormatFromDate(from), getFormatFromDate(to))
	qb := builders.NewSelectRawQueryBuilder(query, []interface{}{from, to})
	var items []domain.BookingKpiDetailsItem

	if err := database.Query(r.db, qb, &items); err != nil {
		return nil, err
	}
	return &items, nil
}

func (r *bookingsRepository) GetBookingPayersConcentrationDetails(from string, to string) (*[]domain.BookingKpiDetailsItem, error) {
	query := `
		WITH top5_payers AS (
			SELECT
				p.id as payer_id,
				p.entity_name as payer,
				SUM(io.net_total_io_cost) AS total_sum
			FROM
				insertion_orders io
			INNER JOIN
				payers p ON io.payer_id = p.id
			WHERE io.deleted_at is null and p.deleted_at is null and
				io.created_at::date BETWEEN $1::date AND $2::date
			GROUP BY
				p.id, p.entity_name
			ORDER BY
					total_sum DESC
				LIMIT 5
		),
		total_payers as (
			SELECT
				SUM(io.net_total_io_cost) AS total_sum
			FROM
				insertion_orders io
			WHERE  io.deleted_at is null and
				io.created_at::date BETWEEN $1::date AND $2::date
		),
		total_top5_payers as  (
			SELECT
				SUM(total_sum) AS total_sum
			FROM
				top5_payers
		),
		total_others_payers as (
			SELECT 'Others' as payer,
				tp.total_sum - t5p.total_sum as total_sum
			FROM total_payers tp, total_top5_payers t5p
		)
		SELECT DISTINCT t5.payer as grouping, case WHEN tp.total_sum > 0 then t5.total_sum / tp.total_sum * 100 else 0 end as total 
		FROM top5_payers t5, total_payers tp
		UNION 
		SELECT th.payer as grouping, case WHEN tp.total_sum > 0 then th.total_sum / tp.total_sum * 100 else 0 end as total 
		FROM total_others_payers th, total_payers tp
		order by total desc 
	`
	qb := builders.NewSelectRawQueryBuilder(query, []interface{}{from, to})
	var items []domain.BookingKpiDetailsItem

	if err := database.Query(r.db, qb, &items); err != nil {
		return nil, err
	}
	return &items, nil
}

func (r *bookingsRepository) GetBookingProductionsConcentrationDetails(from string, to string) (*[]domain.BookingKpiDetailsItem, error) {
	query := `
		WITH top5_productions AS (
			SELECT
				p.id as production_id,
				p.entity_name as production,
				SUM(f.total_cost) AS total_sum
			FROM
				flights f
			INNER JOIN
				productions p ON f.production_id = p.id
			WHERE f.deleted_at is null and p.deleted_at is null and
				f.created_at::date BETWEEN $1::date AND $2::date
			GROUP BY
				p.id, p.entity_name
			ORDER BY
				total_sum DESC
			LIMIT 5
		),
		total_productions as (
			SELECT
				SUM(f.total_cost) AS total_sum
			FROM
				flights f
			WHERE  f.deleted_at is null and 
				f.created_at::date BETWEEN $1::date AND $2::date
		),
		total_top5_productions as  (
			SELECT
				SUM(total_sum) AS total_sum
			FROM
				top5_productions
		),
		total_others_productions as (
			SELECT 'Others' as production,
				tp.total_sum - t5p.total_sum as total_sum
			FROM total_productions tp, total_top5_productions t5p
		)
		SELECT DISTINCT t5.production, case WHEN tp.total_sum > 0 then t5.total_sum / tp.total_sum * 100 else 0 end as total 
		FROM top5_productions t5, total_productions tp
		UNION 
		SELECT th.production, case WHEN tp.total_sum > 0 then th.total_sum / tp.total_sum * 100 else 0 end as total 
		FROM total_others_productions th, total_productions tp
		order by total desc
	`
	qb := builders.NewSelectRawQueryBuilder(query, []interface{}{from, to})
	var items []domain.BookingKpiDetailsItem

	if err := database.Query(r.db, qb, &items); err != nil {
		return nil, err
	}
	return &items, nil
}

func (r *bookingsRepository) GetIoDraftToProcess(process int) (*[]domain.DraftToProcess, error) {
	query := `select id, filepath from get_draft_to_process($1)`
	var items []domain.DraftToProcess
	if err := database.Query(r.db, builders.NewSelectRawQueryBuilder(query, []interface{}{process}), &items); err != nil {
		return nil, err
	}
	return &items, nil
}
