package postgres

import (
	"errors"

	"github.com/jackc/pgx/v5"
	"go.uber.org/zap"
	"selector.dev/database"
	"selector.dev/database/builders"
	br "selector.dev/database/repositories"
	"selector.dev/security/entities"
	"selector.dev/security/exceptions"
)

type userPostgresRepositoryImpl struct {
	logger     *zap.Logger
	unitOfWork database.UnitOfWork
}

func NewUserPostgresRepository(uow database.UnitOfWork, log *zap.Logger) *userPostgresRepositoryImpl {
	return &userPostgresRepositoryImpl{
		unitOfWork: uow,
		logger:     log,
	}
}

func (r *userPostgresRepositoryImpl) FindByEmail(email string) (*entities.User, error) {
	qb := builders.NewSelectRawQueryBuilder("SELECT * FROM users WHERE email = $1", []interface{}{email})
	result, err := br.RunQuery[entities.User](r.unitOfWork, qb)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, exceptions.ErrUserNotFound
		}
		r.logger.Error("error finding user by email", zap.Error(err))
		return nil, err
	}
	if len(*result) == 0 {
		return nil, exceptions.ErrUserNotFound
	}
	user := (*result)[0]
	return &user, nil
}

func (r *userPostgresRepositoryImpl) FindByID(id int64) (*entities.User, error) {
	return &entities.User{}, nil
}

func (r *userPostgresRepositoryImpl) Store(user entities.User) (*int64, error) {
	zero := int64(0)
	return &zero, nil
}

func (r *userPostgresRepositoryImpl) Update(user entities.User) error {
	return nil
}

func (r *userPostgresRepositoryImpl) Delete(id int64) error {
	return nil
}

func (r *userPostgresRepositoryImpl) FindAll() (*[]entities.User, error) {
	return nil, nil
}
