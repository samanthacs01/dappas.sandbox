package repositories

import (
	"go.uber.org/zap"
	"selector.dev/dappas/internal/modules/ecommerce/entities"
	"selector.dev/dappas/internal/modules/ecommerce/repositories/postgres"
	"selector.dev/dappas/internal/modules/ecommerce/shopify"
	"selector.dev/database"
)

type CustomersRepository interface {
	Save(customers *entities.Customer) error
	FindAll() (*[]entities.Customer, error)
	FindPage(page, size int) (*[]entities.Customer, *int64, error)
	FindById(id int64) (*entities.Customer, error)
	Delete(customers *entities.Customer) error
}

func NewCustomersRepository(conn *database.Conn, logger *zap.Logger, s shopify.ECommerceCustomerService) CustomersRepository {
	return postgres.NewPostgresCustomersRepository(conn, logger, s)
}

type ShopifyCustomersRepository interface {
	Save(customers *entities.Customer) error
}