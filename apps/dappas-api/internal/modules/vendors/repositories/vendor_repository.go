package repositories

import (
	"go.uber.org/zap"
	"selector.dev/dappas/internal/modules/vendors/entities"
	"selector.dev/dappas/internal/modules/vendors/repositories/postgres"
	"selector.dev/database"
)

type VendorRepository interface {
	Save(vendor *entities.Vendor) error
	FindAll() (*[]entities.Vendor, error)
	FindPage(page, size int) (*[]entities.Vendor, *int64, error)
	FindById(id int64) (*entities.Vendor, error)
	Delete(vendor *entities.Vendor) error
}

func NewVendorRepository(conn *database.Conn, logger *zap.Logger) VendorRepository {
	return postgres.NewPostgresVendorRepository(conn, logger)
}
