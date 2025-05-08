package repositories

import (
	"go.uber.org/zap"
	"selector.dev/database"
	"selector.dev/security/config"
	"selector.dev/security/entities"
	"selector.dev/security/repositories/google"
	"selector.dev/security/repositories/postgres"
)

//go:generate mockgen -destination=../mocks/mock_user_repository.go -package=mocks selector.dev/security/repositories IUserRepository
type IUserRepository interface {
	FindAll() (*[]entities.User, *int64, error)
	FindByEmail(email string) (*entities.User, error)
	FindByID(id uint) (*entities.User, error)
	Save(user *entities.User) error
	Delete(user *entities.User) error
}

func NewUserRepository(conn *database.Conn, log *zap.Logger) IUserRepository {
	return postgres.NewUserPostgresRepository(conn, log)
}

type IGoogleUserRepository interface {
	GetUserInfo(account, token string) (*entities.GoogleUserInfo, error)
}

func NewGoogleUserRepository(config config.IGoogleConfig, log *zap.Logger) IGoogleUserRepository {
	return google.NewGoogleUserRepositoryImpl(config, log)
}