package postgres

import (
	"errors"

	"github.com/jackc/pgx/v5"
	"go.uber.org/zap"
	"gorm.io/gorm"
	"selector.dev/database"
	"selector.dev/security/entities"
	"selector.dev/security/exceptions"
)

type userPostgresRepositoryImpl struct {
	logger     *zap.Logger
	conn *database.Conn
}

func NewUserPostgresRepository(c *database.Conn, log *zap.Logger) *userPostgresRepositoryImpl {
	return &userPostgresRepositoryImpl{
		conn: c,
		logger: log,
	}
}

func (r *userPostgresRepositoryImpl) FindByEmail(email string) (*entities.User, error) {
	var user entities.User
	query := r.conn.DB.First(&user, "email = ?", email)
	if query.Error != nil {
		if errors.Is(query.Error, pgx.ErrNoRows) {
			return nil, exceptions.ErrUserNotFound
		}
		r.logger.Error("Error finding user by email", zap.Error(query.Error))
		return nil, query.Error
	}
	if query.RowsAffected == 0 {
		return nil, exceptions.ErrUserNotFound
	}
	return &user, nil
}

func (r *userPostgresRepositoryImpl) FindByID(id uint) (*entities.User, error) {
	return &entities.User{}, nil
}

func (r *userPostgresRepositoryImpl) Save(user *entities.User) error {
	return r.conn.UnitOfWork(func(db *gorm.DB) error {
		err := db.Save(user).Error
		if err != nil {
			r.logger.Error("Error saving user", zap.Error(err))
		}
		return err
	})
}

func (r *userPostgresRepositoryImpl) Delete(user *entities.User) error {
	return r.conn.UnitOfWork(func(db *gorm.DB) error {
		if err := db.Delete(&user).Error; err != nil {
			return err
		}
		return nil
	})
}

func (r *userPostgresRepositoryImpl) FindAll() (*[]entities.User, *int64, error) {
	return nil, nil, errors.New("not implemented")
}
