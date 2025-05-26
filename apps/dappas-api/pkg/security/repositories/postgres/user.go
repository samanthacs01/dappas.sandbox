package postgres

import (
	"errors"

	"github.com/jackc/pgx/v5"
	"go.uber.org/zap"
	"gorm.io/gorm"
	"selector.dev/database"
	"selector.dev/security/entities"
	"selector.dev/security/exceptions"
	"selector.dev/security/repositories/hooks"
)

type userPostgresRepositoryImpl struct {
	logger     *zap.Logger
	conn *database.Conn
	hooks hooks.IUseSaveHooks
}

func NewUserPostgresRepository(c *database.Conn, log *zap.Logger, hooks hooks.IUseSaveHooks) *userPostgresRepositoryImpl {
	return &userPostgresRepositoryImpl{
		conn: c,
		logger: log,
		hooks: hooks,
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
		if err := r.hooks.BeforeSave(user); err != nil {
			r.logger.Error("Error in BeforeSave hook", zap.Error(err))
			return err
		}
		if err := db.Save(user).Error; err != nil {
			r.logger.Error("Error saving user", zap.Error(err))
		}
		if err := r.hooks.AfterSave(user); err != nil {
			r.logger.Error("Error in AfterSave hook", zap.Error(err))
			return err
		}
		return nil
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
