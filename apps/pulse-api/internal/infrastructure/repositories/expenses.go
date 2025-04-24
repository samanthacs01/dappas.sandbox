package repositories

import (
	"context"
	"errors"
	"fmt"
	"strconv"
	"strings"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"go.uber.org/zap"
	"selector.dev/database"
	"selector.dev/database/builders"
	"selector.dev/pulse/config"
	domain "selector.dev/pulse/internal/domain/expenses"
	"selector.dev/pulse/internal/domain/shared/services"
	"selector.dev/pulse/internal/infrastructure/database/models"
	"selector.dev/utils"
)

type expenseRepository struct {
	db      *database.Conn
	logger  *zap.Logger
	ctx     context.Context
	session services.ISessionServices
	config  config.FileManagerConfig
}

func NewExpensesRepository(db *database.Conn, l *zap.Logger, ctx context.Context, s services.ISessionServices, config config.FileManagerConfig) domain.IExpensesRepository {
	return &expenseRepository{
		db:      db,
		logger:  l,
		ctx:     ctx,
		session: s,
		config:  config,
	}
}

func (r *expenseRepository) FindAllExpenses(
	productions *[]int,
	months *[]string,
	from string,
	to string,
	limit *int,
	offset *int,
	sort []struct{ Field, Direction string },
) (*[]domain.Expense, *int64, error) {

	var expenses []models.ViewExpense
	qb := database.Select(models.ViewExpense{})

	if productions != nil && len(*productions) > 0 {
		qb.InInt("production_id", *productions)
	}
	if months != nil && len(*months) > 0 {
		qb.InString("month", *months)
	}
	if len(from) > 0 {
		qb.GreaterOrEqualThan("created_at", from)
	}
	if len(to) > 0 {
		qb.LessOrEqualThan("created_at", from)
	}

	var counts []models.CountResult
	if err := database.Query(r.db, qb.ToCount(), &counts); err != nil {
		r.logger.Error("Error while querying expenses count", zap.Error(err))
		return nil, nil, err
	}
	if len(counts) == 0 {
		return nil, nil, domain.ErrExpenseNotFound
	}
	total := counts[0].Count

	if limit != nil {
		qb.Take(*limit)
	}
	if offset != nil {
		qb.Skip(*offset)
	}

	qb.OrderByFields(sort, mapExpenseSortFields)

	query, args := qb.Build()
	r.logger.Info("Querying expenses",
		zap.String("query", query),
		zap.Any("args", args),
	)

	if err := database.Query(r.db, qb, &expenses); err != nil {
		r.logger.Error("Error while querying expenses", zap.Error(err))
		return nil, nil, err
	}

	items := utils.Map(expenses, func(e models.ViewExpense) domain.Expense {
		return domain.Expense{
			Id:             e.Id,
			ProductionId:   e.ProductionId,
			ProductionName: e.ProductionName,
			Month:          e.Month,
			Year:           e.Year,
			TotalAmount:    e.TotalAmount,
		}
	})

	return &items, &total, nil
}

func (r *expenseRepository) CreateExpense(e *domain.Expense, docs []domain.ExpenseDoc) (*domain.Expense, error) {
	userId := r.session.GetUserId()
	if userId == nil {
		return nil, errors.New("unauthorized")
	}
	err := r.db.UnitOfWork(r.ctx, func(ctx context.Context, tx pgx.Tx) error {
		r.logger.Info("CreateExpense", zap.Any("expense", e))
		expense := models.Expense{
			Month:        e.Month,
			Year:         e.Year,
			ProductionId: e.ProductionId,
			TotalAmount:  e.TotalAmount,
		}
		var result []models.CreatedResult
		qb := database.InsertInto(expense)

		if e := database.Save(r.ctx, tx, qb, &result, userId); e != nil {
			return e
		}

		if len(result) == 0 {
			return domain.ErrExpenseNotCreated
		}
		e.Id = result[0].ID

		for _, d := range docs {
			doc := models.ExpenseDoc{
				ExpenseId: e.Id,
				DocName:   d.DocName,
				DocPath:   d.DocPath,
			}

			var res []models.CreatedResult
			qb = database.InsertInto(doc)

			if err := database.Save(r.ctx, tx, qb, &res, userId); err != nil {
				r.logger.Error("Error while creating expense doc", zap.Error(err))
				return err
			}
		}
		args := []interface{}{userId}
		funQb := builders.NewSelectRawQueryBuilder(fmt.Sprintf("select recalculate_with_expenses(%d, '%s', '%s', $1)", e.ProductionId, e.Month, e.Year), args)
		query, _args := funQb.Build()
		r.logger.Info("RE-CAL bills", zap.Any("query", query), zap.Any("args", _args))
		if err := database.ExecInTx(ctx, tx, funQb); err != nil {
			r.logger.Info("ERROR recalculating", zap.Error(err))
			if err, ok := err.(*pgconn.PgError); ok && err.Code == "P0001" {
				return domain.ErrExpenseAfterAppliedRetentions
			}
			return err
		}
		return nil
	})

	return e, err
}

func (r *expenseRepository) DeleteExpense(id uint) error {
	userId := r.session.GetUserId()
	if userId == nil {
		return errors.New("unauthorized")
	}

	return r.db.UnitOfWork(r.ctx, func(ctx context.Context, tx pgx.Tx) error {
		exp, _, err := r.FindExpenseById(id)
		if err != nil {
			return err
		}
		qb := database.SoftDeleteFrom(models.Expense{})
		qb.Equal("id", id)
		if _, err = database.Exec(ctx, tx, qb, userId); err != nil {
			r.logger.Error("Error while deleting expense", zap.Error(err))
			return err
		}
		args := []interface{}{userId}
		funQb := builders.NewSelectRawQueryBuilder(fmt.Sprintf("select recalculate_with_expenses(%d, '%s', '%s', $1)", exp.ProductionId, exp.Month, exp.Year), args)
		query, _args := funQb.Build()
		r.logger.Info("RE-CAL bills", zap.Any("query", query), zap.Any("args", _args))
		err = database.ExecInTx(ctx, tx, funQb)
		if err != nil {
			if err, ok := err.(*pgconn.PgError); ok && err.Code == "P0001" {
				return domain.ErrExpenseAfterAppliedRetentions
			}
		}
		return err
	})
}

func (r *expenseRepository) FindExpenseById(id uint) (*domain.Expense, *[]domain.ExpenseDoc, error) {
	qb := database.Select(models.ViewExpense{})
	qb.Equal("id", id)

	var items []models.ViewExpense
	if err := database.Query(r.db, qb, &items); err != nil {
		r.logger.Error("Error while querying expense by ID", zap.Error(err))
		return nil, nil, err
	}

	if len(items) == 0 {
		return nil, nil, domain.ErrExpenseNotFound
	}

	e := items[0]
	expense := domain.Expense{
		Id:             e.Id,
		ProductionId:   e.ProductionId,
		ProductionName: e.ProductionName,
		Month:          e.Month,
		Year:           e.Year,
		TotalAmount:    e.TotalAmount,
	}

	qb = database.Select(models.ExpenseDoc{})
	qb.Equal("expense_id", id)
	var docs []models.ExpenseDoc
	if err := database.Query(r.db, qb, &docs); err != nil {
		r.logger.Error("Error while querying expense by ID", zap.Error(err))
		return nil, nil, err
	}
	_docs := utils.Map(docs, func(d models.ExpenseDoc) domain.ExpenseDoc {
		realPath := r.config.GetRealPath(d.DocPath)
		if d.DocPath == "" {
			realPath = ""
		}

		return domain.ExpenseDoc{
			Id:        d.Id,
			ExpenseId: d.ExpenseId,
			DocName:   d.DocName,
			DocPath:   realPath,
		}
	})
	return &expense, &_docs, nil
}

func (r *expenseRepository) UpdateExpense(e *domain.Expense, newDocs []domain.ExpenseDoc, deleteFiles []int) (*domain.Expense, error) {
	userId := r.session.GetUserId()
	if userId == nil {
		return nil, errors.New("unauthorized")
	}

	qb := database.Update(models.Expense{})

	qb.Equal("id", e.Id)

	if e.Month != "" {
		qb.Set("month", e.Month)
	}
	if e.Year != "" {
		qb.Set("year", e.Year)
	}
	if e.ProductionId != 0 {
		qb.Set("production_id", e.ProductionId)
	}
	if e.TotalAmount != 0 {
		qb.Set("total_deduction", e.TotalAmount)
	}

	err := r.db.UnitOfWork(r.ctx, func(ctx context.Context, tx pgx.Tx) error {
		result, execErr := database.Exec(ctx, tx, qb, userId)
		if execErr != nil {
			r.logger.Error("Error while updating expense", zap.Error(execErr))
			return execErr
		}

		rowsAffected := *result
		if rowsAffected == 0 {
			return domain.ErrExpenseNotFound
		}

		if len(newDocs) > 0 {
			for _, doc := range newDocs {
				insertQuery := `INSERT INTO expense_docs (expense_id, file_name, file_path) VALUES ($1, $2, $3)`
				_, err := tx.Exec(ctx, insertQuery, e.Id, doc.DocName, doc.DocPath)
				if err != nil {
					r.logger.Error("Error while creating expense doc", zap.Error(err))
					return err
				}
			}
		}
		if (deleteFiles) != nil {
			ids := utils.Map(deleteFiles, func(id int) string {
				return strconv.Itoa(id)
			})
			deleteQuery := fmt.Sprintf(`DELETE FROM expense_docs WHERE id =any('{%s}'::int[])`, strings.Join(ids, ","))
			_, err := tx.Exec(ctx, deleteQuery)
			if err != nil {
				r.logger.Error("Error while deleting expense doc", zap.Error(err))
				return err
			}
		}
		args := []interface{}{userId}
		funQb := builders.NewSelectRawQueryBuilder(fmt.Sprintf("select recalculate_with_expenses(%d, '%s', '%s', $1)", e.ProductionId, e.Month, e.Year), args)
		query, _args := funQb.Build()
		r.logger.Info("RE-CAL bills", zap.Any("query", query), zap.Any("args", _args))
		err := database.ExecInTx(ctx, tx, funQb)
		if err != nil {
			if err, ok := err.(*pgconn.PgError); ok && err.Code == "P0001" {
				return domain.ErrExpenseAfterAppliedRetentions
			}
		}
		return err
	})
	if err != nil {
		return nil, err
	}

	return e, nil
}

var mapExpenseSortFields = map[string]string{
	"month_years":     "year, month",
	"production_name": "UPPER(production_name)",
	"total_deduction": "total_amount",
}
