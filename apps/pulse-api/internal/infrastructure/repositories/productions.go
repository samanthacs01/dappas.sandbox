package repositories

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"go.uber.org/zap"
	"selector.dev/database"
	"selector.dev/database/builders"
	domain "selector.dev/pulse/internal/domain/payables"
	"selector.dev/pulse/internal/domain/shared"
	"selector.dev/pulse/internal/domain/shared/services"
	"selector.dev/pulse/internal/domain/user"
	"selector.dev/pulse/internal/infrastructure/database/models"
	"selector.dev/utils"
)

type productionRepository struct {
	db      *database.Conn
	logger  *zap.Logger
	ctx     context.Context
	session services.ISessionServices
	users   services.IUserManagement
}

func NewProductionsRepository(db *database.Conn, l *zap.Logger, ctx context.Context, s services.ISessionServices, u services.IUserManagement) domain.IProductionsRepository {
	return &productionRepository{
		db:      db,
		logger:  l,
		ctx:     ctx,
		session: s,
		users:   u,
	}
}

func (r *productionRepository) FindProductionByID(id uint) (*domain.Production, error) {
	var productions []domain.Production
	qb := database.Select(domain.Production{})
	qb.IsNull("deleted_at")
	qb.Equal("id", id)

	if err := database.Query(r.db, qb, &productions); err != nil {
		r.logger.Error("Error while querying production", zap.Error(err))
		return nil, err
	}
	if len(productions) == 0 {
		return nil, domain.ErrProductionNotFound
	}
	return &productions[0], nil
}

func (r *productionRepository) FindAllProductions(search *string, limit *int, offset *int, sorts []struct{ Field, Direction string }) (*[]domain.ProductionListItem, *int64, error) {
	var productions []models.ViewProduction
	qb := database.Select(models.ViewProduction{})
	if search != nil && *search != "" {
		qb.Like("entity_name", *search)
	}

	var counts []models.CountResult

	if err := database.Query(r.db, qb.ToCount(), &counts); err != nil {
		r.logger.Error("Error while querying productions", zap.Error(err))
		return nil, nil, err
	}

	if len(counts) == 0 {
		return nil, nil, domain.ErrProductionNotFound
	}
	total := counts[0].Count

	qb.OrderByFields(sorts, sortProductionFieldMap)

	if limit != nil {
		qb.Take(*limit)
	}
	if offset != nil {
		qb.Skip(*offset)
	}

	if err := database.Query(r.db, qb, &productions); err != nil {
		r.logger.Error("Error while querying productions", zap.Error(err))
		return nil, nil, err
	}

	items := utils.Map(productions, func(p models.ViewProduction) domain.ProductionListItem {
		return domain.ProductionListItem{
			Id:          p.ID,
			EntityName:  p.EntityName,
			Balance:     p.Balance,
			Dpo:         p.Dpo,
			PaymentType: domain.ProductionBillingType(p.PaymentType),
		}
	})
	return &items, &total, nil
}

func (r *productionRepository) FindAllProductionsAsNomenclator() (*[]shared.Nomenclator, error) {
	var productions []shared.Nomenclator
	qb := builders.NewSelectRawQueryBuilder("SELECT id::text, entity_name FROM view_productions", []interface{}{})

	if err := database.Query(r.db, qb, &productions); err != nil {
		r.logger.Error("Error while querying productions", zap.Error(err))
		return nil, err
	}

	return &productions, nil
}

func (r *productionRepository) CreateProduction(production *domain.Production) (*domain.Production, error) {
	userId := r.session.GetUserId()
	if userId == nil {
		return nil, errors.New("unauthorized")
	}
	_changeBy := fmt.Sprintf("%d", *userId)
	err := r.db.UnitOfWork(r.ctx, func(ctx context.Context, tx pgx.Tx) error {
		production.ChangeBy = &_changeBy
		var result []models.CreatedResult
		qb := database.InsertInto(production)
		if err := database.Save(r.ctx, tx, qb, &result, userId); err != nil {
			query, params := qb.Build()
			r.logger.Error("Error while inserting production", zap.Error(err), zap.String("query", query), zap.Any("params", params))
			return err
		}
		production.Id = uint(result[0].ID)
		_, err := r.users.FindUserByEmail(production.ContactEmail)
		if err != nil {
			if errors.Is(err, user.ErrUserNotFound) {
				return r.sendEmailInvitation(*production)
			}
			r.logger.Error("Error while checking existing user", zap.Error(err))
			return err
		}

		return nil
	})
	return production, err
}

func (r *productionRepository) sendEmailInvitation(production domain.Production) error {
	now := time.Now()
	tokens := map[string]string{
		"{{entity_name}}":   production.ContactName,
		"{{contact_email}}": production.ContactEmail,
		"{{creation_date}}": now.Format("Jan 02, 2006"),
	}
	return r.users.InviteNewUser(production.ContactEmail, production.ContactName, &production.Id, shared.RoleProduction, tokens)
}

func (r *productionRepository) DeleteProductionByID(id uint) error {
	userId := r.session.GetUserId()
	if userId == nil {
		return errors.New("unauthorized")
	}
	_changeBy := fmt.Sprintf("%d", *userId)
	return r.db.UnitOfWork(r.ctx, func(ctx context.Context, tx pgx.Tx) error {
		production, err := r.FindProductionByID(id)
		if err != nil {
			return err
		}

		if production.DeletedAt != nil {
			return errors.New("production already deleted")
		}

		qb := database.SoftDeleteFrom(domain.Production{})
		qb.Equal("id", id)
		qb.Set("change_by", _changeBy)

		_, err = database.Exec(ctx, tx, qb, userId)
		return err
	})
}

func (r *productionRepository) UpdateProduction(id uint, updateData *domain.ProductionUpdateData) error {
	userId := r.session.GetUserId()
	if userId == nil {
		return errors.New("unauthorized")
	}
	_changeBy := fmt.Sprintf("%d", *userId)

	return r.db.UnitOfWork(r.ctx, func(ctx context.Context, tx pgx.Tx) error {
		qb := database.Update(domain.Production{}).
			Set("entity_name", updateData.EntityName).
			Set("address", updateData.EntityAddress).
			Set("contact_name", updateData.ContactName).
			Set("contact_phone_number", updateData.ContactPhoneNumber).
			Set("production_split", updateData.ProductionSplit).
			Set("production_billing_type", updateData.ProductionBillingType).
			Set("production_expense_discount_type", updateData.ProductionExpenseRecoupmentType).
			Set("net_payment_terms", updateData.NetPaymentTerms).
			Set("change_by", _changeBy)

		if updateData.ContractFilePath != "" {
			qb.Set("contract_file_path", updateData.ContractFilePath)
		}

		qb.Equal("id", id)
		query, params := qb.Build()
		r.logger.Info("UpdateProduction", zap.String("query", query), zap.Any("params", params))

		affected, err := database.Exec(ctx, tx, qb, userId)
		if err != nil {
			r.logger.Error("Error updating production", zap.Error(err))
			return err
		}

		if *affected == 0 {
			return domain.ErrProductionNotFound
		}

		return nil
	})
}

func (r *productionRepository) GetProductionStatsKpi(id uint, start, end string) (domain.ProductionStats, error) {
	var result []domain.ProductionStats
	_args := []interface{}{id, start, end}
	qb := builders.NewSelectRawQueryBuilder("SELECT booking, net_revenue, next_payment_amount, case when next_payment_date is null then null else to_char(next_payment_date, 'MM/DD/YYYY') end as next_payment_date, avg_monthly_revenue, percent_variation FROM get_production_details_kpi($1, $2::date, $3::date)", _args)
	if err := database.Query(r.db, qb, &result); err != nil {
		r.logger.Error("Error while querying production stats", zap.Error(err))
		return domain.ProductionStats{}, err
	}
	if len(result) == 0 {
		return domain.ProductionStats{}, nil
	}
	return result[0], nil
}
func (r *productionRepository) GetProductionDetailsStatsKpiDetails(id uint, statType, start, end string) ([]domain.PayablesKpiDetailsItem, error) {
	qb := _productionDetailsQueryByStatsType(id, statType, start, end)
	var items []domain.PayablesKpiDetailsItem
	if err := database.Query(r.db, qb, &items); err != nil {
		r.logger.Error("Error while querying receivables stats", zap.Error(err))
		return items, err
	}
	if items == nil {
		items = []domain.PayablesKpiDetailsItem{}
	}
	return items, nil
}

var sortProductionFieldMap = map[string]string{
	"entity_name":  "UPPER(entity_name)",
	"payment_type": "UPPER(payment_type)",
}

func _productionDetailsQueryByStatsType(id uint, statType, start, end string) database.IQueryBuilder {
	fmt.Println(statType)
	_startFormat := getFormatFromDate(start)
	_endFormat := getFormatFromDate(end)
	store := ""
	switch statType {
	case "production_details_bookings":
		store = "get_production_details_booking_dates"
	case "production_details_net_revenues":
		store = "get_production_details_revenues_dates"
	}
	query := fmt.Sprintf("SELECT grouping, grouping_details, total FROM %s($1, TO_DATE($2, '%s'), TO_DATE($3, '%s'))", store, _startFormat, _endFormat)
	return database.SelectRaw(query, []interface{}{id, start, end})
}
