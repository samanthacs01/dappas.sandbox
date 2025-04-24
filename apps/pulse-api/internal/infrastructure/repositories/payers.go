package repositories

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
	"go.uber.org/zap"
	"selector.dev/database"
	"selector.dev/database/builders"
	domain "selector.dev/pulse/internal/domain/receivables"
	"selector.dev/pulse/internal/domain/shared"
	"selector.dev/pulse/internal/domain/shared/services"
	"selector.dev/pulse/internal/infrastructure/database/models"
	"selector.dev/utils"
)

type payersRepository struct {
	db      *database.Conn
	logger  *zap.Logger
	session services.ISessionServices
}

func NewPayersRepository(db *database.Conn, l *zap.Logger, s services.ISessionServices) domain.IPayersRepository {
	return &payersRepository{
		db:      db,
		logger:  l,
		session: s,
	}
}

func (r *payersRepository) FindPayerByID(id uint) (*domain.Payer, error) {
	var payers []models.ViewPayer
	qb := database.Select(models.ViewPayer{})
	qb.Equal("id", id)

	if err := database.Query(r.db, qb, &payers); err != nil {
		r.logger.Error("Error while querying payer", zap.Error(err))
		return nil, err
	}
	if len(payers) == 0 {
		return nil, domain.ErrPayerNotFound
	}
	payer := domain.Payer{
		Id:                 payers[0].ID,
		EntityName:         payers[0].EntityName,
		EntityAddress:      payers[0].EntityAddress,
		ContactEmail:       payers[0].ContactEmail,
		ContactName:        payers[0].ContactName,
		ContactPhoneNumber: payers[0].ContactPhoneNumber,
		Identifier:         payers[0].Identifier,
		PaymentTerms:       payers[0].PaymentTerms,
	}
	return &payer, nil
}

func (r *payersRepository) FindAllPayersAsNomenclator() (*[]shared.Nomenclator, error) {
	var payers []shared.Nomenclator
	qb := builders.NewSelectRawQueryBuilder("SELECT id::text, entity_name FROM view_payers", []interface{}{})
	if err := database.Query(r.db, qb, &payers); err != nil {
		r.logger.Error("Error while querying payers", zap.Error(err))
		return nil, err
	}
	return &payers, nil
}

func (r *payersRepository) FindAllPayers(search *string, limit *int, offset *int, sorts []struct{ Field, Direction string }) (*[]domain.Payer, *int64, error) {
	var productions []models.ViewPayer
	qb := database.Select(models.ViewPayer{})
	if search != nil && *search != "" {
		qb.Like("search_field", *search)
	}

	var counts []models.CountResult

	if err := database.Query(r.db, qb.ToCount(), &counts); err != nil {
		r.logger.Error("Error while querying payers", zap.Error(err))
		return nil, nil, err
	}

	if len(counts) == 0 {
		return nil, nil, domain.ErrPayerNotFound
	}
	total := counts[0].Count

	if limit != nil {
		qb.Take(*limit)
	}
	if offset != nil {
		qb.Skip(*offset)
	}

	qb.OrderByFields(sorts, mapPayerSortField)

	if err := database.Query(r.db, qb, &productions); err != nil {
		r.logger.Error("Error while querying payers", zap.Error(err))
		return nil, nil, err
	}

	items := utils.Map(productions, func(p models.ViewPayer) domain.Payer {
		return domain.Payer{
			Id:                 p.ID,
			EntityName:         p.EntityName,
			EntityAddress:      p.EntityAddress,
			ContactEmail:       p.ContactEmail,
			ContactName:        p.ContactName,
			ContactPhoneNumber: p.ContactPhoneNumber,
			Identifier:         p.Identifier,
			PaymentTerms:       p.PaymentTerms,
		}
	})
	return &items, &total, nil
}

func (r *payersRepository) CreatePayer(payer *domain.Payer) (*domain.Payer, error) {
	userId := r.session.GetUserId()
	if userId == nil {
		return nil, domain.ErrUnauthorized
	}

	ctx := context.WithValue(context.Background(), userIDKey, *userId)
	_changeBy := fmt.Sprintf("%d", *userId)

	err := r.db.UnitOfWork(ctx, func(ctx context.Context, tx pgx.Tx) error {
		payer.ChangeBy = &_changeBy
		qb := database.InsertInto(payer)
		var result []models.CreatedResult
		if err := database.Save(ctx, tx, qb, &result, userId); err != nil {
			r.logger.Error("Error while creating payer", zap.Error(err))
			return err
		}
		payer.Id = uint(result[0].ID)
		return nil
	})
	return payer, err
}

func (r *payersRepository) DeletePayer(id uint) error {
	userId := r.session.GetUserId()
	if userId == nil {
		return domain.ErrUnauthorized
	}
	_changeBy := fmt.Sprintf("%d", *userId)
	ctx := context.WithValue(context.Background(), userIDKey, *userId)

	qb := database.SoftDeleteFrom(domain.Payer{})
	qb.Equal("id", id)
	qb.Set("change_by", _changeBy)

	return r.db.UnitOfWork(ctx, func(ctx context.Context, tx pgx.Tx) error {
		affected, err := database.Exec(ctx, tx, qb, userId)
		if affected != nil {
			r.logger.Info("Delete Payer", zap.Int64("AFFECTED", *affected))
		}
		return err
	})
}

func (r *payersRepository) UpdatePayer(payer *domain.Payer) (*domain.Payer, error) {
	userId := r.session.GetUserId()
	if userId == nil {
		return nil, domain.ErrUnauthorized
	}
	ctx := context.WithValue(context.Background(), userIDKey, *userId)
	_changeBy := fmt.Sprintf("%d", *userId)
	err := r.db.UnitOfWork(ctx, func(ctx context.Context, tx pgx.Tx) error {
		qb := database.Update(domain.Payer{}).
			Set("entity_name", payer.EntityName).
			Set("entity_address", payer.EntityAddress).
			Set("contact_name", payer.ContactName).
			Set("contact_phone_number", payer.ContactPhoneNumber).
			Set("contact_email", payer.ContactEmail).
			Set("payment_terms", payer.PaymentTerms).
			Set("change_by", _changeBy)

		qb.Equal("id", payer.Id)

		_, err := database.Exec(ctx, tx, qb, &payer.Id)
		return err
	})

	if err != nil {
		return nil, err
	}

	result, _ := r.FindPayerByID(payer.Id)
	return result, nil
}

var mapPayerSortField = map[string]string{
	"entity_name":    "UPPER(entity_name)",
	"entity_address": "UPPER(entity_address)",
	"contact_name":   "UPPER(contact_name)",
	"contact_phone":  "UPPER(contact_phone)",
	"contact_email":  "UPPER(contact_email)",
	"payment_terms":  "payment_terms",
}
