package repositories

import (
	"go.uber.org/zap"
	"selector.dev/database"
	"selector.dev/dappas/internal/modules/ecommerce/entities"
	"selector.dev/dappas/internal/modules/ecommerce/repositories/postgres"
)

type InstallRepository interface {
	Save(install *entities.Install) error
	FindAll() (*[]entities.Install, error)
	FindPage(page, size int) (*[]entities.Install, *int64, error)
	FindById(id int64) (*entities.Install, error)
	Delete(install *entities.Install) error
}
	
func NewInstallRepository(conn *database.Conn, logger *zap.Logger) InstallRepository {
	return postgres.NewPostgresInstallRepository(conn, logger)
}
