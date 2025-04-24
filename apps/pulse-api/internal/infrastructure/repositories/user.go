package repositories

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"go.uber.org/zap"
	"selector.dev/database"
	domain "selector.dev/pulse/internal/domain/user"
	"selector.dev/pulse/internal/infrastructure/database/models"
)

type userRepository struct {
	db     *database.Conn
	logger *zap.Logger
	ctx    context.Context
}

func NewUserRepository(db *database.Conn, l *zap.Logger, ctx context.Context) domain.IUserRepository {
	return &userRepository{
		db:     db,
		logger: l,
		ctx:    ctx,
	}
}

func (r *userRepository) FindUserByEmail(email string) (*domain.User, error) {
	var users []domain.User
	qb := database.Select(domain.User{})
	qb.IsNull("deleted_at")
	qb.Equal("email", email)
	query, args := qb.Build()
	r.logger.Info("Querying user", zap.String("query", query), zap.Any("args", args))
	if err := database.Query(r.db, qb, &users); err != nil {
		r.logger.Error("Error while querying user", zap.Error(err))
		return nil, domain.ErrInvalidCredentials
	}
	if len(users) == 0 {
		r.logger.Error("Error while querying user", zap.Error(domain.ErrUserNotFound))
		return nil, domain.ErrUserNotFound
	}
	r.logger.Info("User found", zap.Uint("ID", users[0].Id))
	return &users[0], nil
}

func (r *userRepository) CreateNewUserSession(id uint, token string) error {
	r.logger.Info("CreateNewUserSession", zap.Uint("id", id), zap.String("token", token))
	sessions, _ := r.findSessionsByToken(token)
	if sessions != nil {
		for _, s := range *sessions {
			if s.DeletedAt == nil {
				return nil
			}
		}
	}
	return r.db.UnitOfWork(r.ctx, func(ctx context.Context, tx pgx.Tx) error {
		session := models.Session{
			UserId: id,
			Token:  token,
		}
		qb := database.InsertInto(session)
		var result []models.CreatedResult
		err := database.Save(r.ctx, tx, qb, &result, &id)
		if err != nil {
			query, args := qb.Build()
			r.logger.Error("Error while creating new user session", zap.Error(err), zap.Any("args", args), zap.String("query", query))
		}
		if len(result) > 0 {
			r.logger.Info("CreateNewUserSession", zap.Uint("ID", result[0].ID))
		}
		return err
	})
}

func (r *userRepository) IsValidToken(token string, userId uint) bool {
	sessions, _ := r.findSessionsByToken(token)
	if sessions == nil {
		return false
	}
	for _, s := range *sessions {
		if s.UserId == userId && s.DeletedAt == nil {
			return true
		}
	}
	return false
}

func (r *userRepository) DeleteUserSession(token string, userId uint) error {
	qb := database.SoftDeleteFrom(models.Session{})
	qb.Equal("token", token)
	return r.db.UnitOfWork(r.ctx, func(ctx context.Context, tx pgx.Tx) error {
		affected, err := database.Exec(r.ctx, tx, qb, &userId)
		if affected != nil {
			r.logger.Info("DeleteUserSession", zap.Int64("AFFECTED", *affected))
		}
		return err
	})
}

func (r *userRepository) CreateUser(user *domain.User) (*uint, error) {
	err := r.db.UnitOfWork(r.ctx, func(ctx context.Context, tx pgx.Tx) error {
		var result []models.CreatedResult
		var lastUsers []domain.User
		qb := database.Select(domain.User{}).OrderByDesc("id")
		if err := database.Query(r.db, qb, &lastUsers); err != nil {
			r.logger.Error("Error while fetching last user ID", zap.Error(err))
			return err
		}

		if len(lastUsers) > 0 {
			user.Id = lastUsers[0].Id + 1
		} else {
			user.Id = 1
		}
		insertQb := database.InsertInto(user)
		err := database.Save(r.ctx, tx, insertQb, &result, &user.Id)
		if err != nil {
			query, args := qb.Build()
			r.logger.Error("Error while creating user", zap.Error(err), zap.String("query", query), zap.Any("args", args))
			return err
		}
		if len(result) > 0 {
			user.Id = result[0].ID
			r.logger.Info("CreateUser", zap.Uint("ID", user.Id))
		}
		return err
	})

	return &user.Id, err
}

func (r *userRepository) UpdateUser(user *domain.User) error {
	return r.db.UnitOfWork(r.ctx, func(ctx context.Context, tx pgx.Tx) error {
		qb := database.Update(user)
		qb.Set("password_hash", user.PasswordHash).
			Set("active", user.Active).
			Equal("id", user.Id)

		_, err := database.Exec(r.ctx, tx, qb, &user.Id)
		return err
	})
}

func (r *userRepository) FindUserByToken(token string) (*domain.User, error) {
	var users []domain.User
	qb := database.Select(domain.User{})
	qb.IsNull("deleted_at")
	qb.Equal("password_hash", token)
	query, args := qb.Build()
	r.logger.Info("Querying user", zap.String("query", query), zap.Any("args", args))
	if err := database.Query(r.db, qb, &users); err != nil {
		r.logger.Error("Error while querying user", zap.Error(err))
		return nil, domain.ErrUserNotFound
	}
	if len(users) == 0 {
		r.logger.Error("Error while querying user", zap.Error(domain.ErrUserNotFound))
		return nil, domain.ErrUserNotFound
	}
	r.logger.Info("User found", zap.Uint("ID", users[0].Id))
	return &users[0], nil
}

func (r *userRepository) findSessionsByToken(token string) (*[]models.Session, error) {
	var sessions []models.Session
	qb := database.Select(models.Session{})
	qb.Equal("token", token)
	if err := database.Query(r.db, qb, &sessions); err != nil {
		r.logger.Error("Error while querying session", zap.Error(err))
		return nil, err
	}
	if len(sessions) == 0 {
		err := errors.New("session not found")
		r.logger.Error("Error while querying session", zap.Error(err))
		return nil, err
	}
	return &sessions, nil
}

func (r *userRepository) FindAllUsers(criteria domain.UserListFilter) ([]models.ViewUser, *int64, error) {
	var users []models.ViewUser
	qb := database.Select(models.ViewUser{})

	if criteria.Search != nil && *criteria.Search != "" {
		qb.Like("search", *criteria.Search)
	}

	if criteria.Role != nil && len(*criteria.Role) > 0 {
		qb.InString("role", *criteria.Role)
	}

	if criteria.Status != nil {
		qb.Equal("active", criteria.Status)
	}

	var counts []models.CountResult
	countQuery, countArgs := qb.Build()
	r.logger.Info("Querying users count", zap.String("Query", countQuery), zap.Any("Args", countArgs))
	if err := database.Query(r.db, qb.ToCount(), &counts); err != nil {
		query, args := qb.Build()
		r.logger.Error("Error while querying count of users", zap.Error(err), zap.String("Query", query), zap.Any("Args", args))
		return nil, nil, err
	}

	if len(counts) == 0 {
		zero := int64(0)
		return []models.ViewUser{}, &zero, nil
	}

	total := counts[0].Count

	qb.OrderByFields(criteria.GetSorts(), mapUserSortField)

	var size int
	if criteria.Size != nil {
		size = *criteria.Size
		qb.Take(size)
	}
	if criteria.Page != nil {
		offset := size * (*criteria.Page - 1)
		qb.Skip(offset)
	}

	if err := database.Query(r.db, qb, &users); err != nil {
		query, args := qb.Build()
		r.logger.Error("Error while querying users", zap.Error(err), zap.String("QUERY", query), zap.Any("Args", args))
		return nil, nil, err
	}

	return users, &total, nil
}

func (r *userRepository) FindUserById(id uint) (*models.ViewUser, error) {
	var users []models.ViewUser
	qb := database.Select(models.ViewUser{})
	qb.Equal("id", id)
	query, args := qb.Build()
	r.logger.Info("Querying user", zap.String("query", query), zap.Any("args", args))
	if err := database.Query(r.db, qb, &users); err != nil {
		r.logger.Error("Error while querying user", zap.Error(err))
		return nil, domain.ErrInvalidCredentials
	}
	if len(users) == 0 {
		r.logger.Error("Error while querying user", zap.Error(domain.ErrUserNotFound))
		return nil, domain.ErrUserNotFound
	}
	r.logger.Info("User found", zap.Uint("ID", users[0].Id))
	return &users[0], nil
}

func (r *userRepository) UpdateUserData(user *domain.User) error {
	return r.db.UnitOfWork(r.ctx, func(ctx context.Context, tx pgx.Tx) error {
		qb := database.Update(user)
		qb.Set("first_name", user.FirstName).
			Set("last_name", user.LastName).
			Set("role", user.Role).
			Equal("id", user.Id)

		affected, err := database.Exec(r.ctx, tx, qb, &user.Id)
		if affected != nil && *affected == 0 {
			return domain.ErrUserNotFound
		}

		return err
	})
}

func (r *userRepository) DeleteUser(id uint, userId *uint) error {
	qb := database.SoftDeleteFrom(domain.User{})
	qb.Equal("id", id)

	return r.db.UnitOfWork(r.ctx, func(ctx context.Context, tx pgx.Tx) error {
		affected, err := database.Exec(ctx, tx, qb, userId)
		if affected != nil {
			r.logger.Info("Delete User", zap.Int64("AFFECTED", *affected))
		}
		return err
	})
}

var mapUserSortField map[string]string = map[string]string{
	"first_name": "UPPER(first_name)",
	"last_name":  "UPPER(last_name)",
	"email":      "UPPER(email)",
	"role":       "UPPER(role)",
	"status":     "active",
}
