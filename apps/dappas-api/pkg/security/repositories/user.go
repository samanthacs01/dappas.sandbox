package repositories

import (
	"go.uber.org/zap"
	"selector.dev/database"
	"selector.dev/security/entities"
	"selector.dev/security/repositories/postgres"
)

//go:generate mockgen -destination=../mocks/mock_user_repository.go -package=mocks selector.dev/security/repositories IUserRepository
type IUserRepository interface {
	FindAll() (*[]entities.User, error)
	FindByEmail(email string) (*entities.User, error)
	FindByID(id int64) (*entities.User, error)
	Store(user entities.User) (*int64, error)
	Update(user entities.User) error
	Delete(id int64) error
}

func NewUserRepository(uow database.UnitOfWork, log *zap.Logger) IUserRepository {
	return postgres.NewUserPostgresRepository(uow, log)
}
