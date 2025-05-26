package postgres

import (
	"go.uber.org/zap"
	"gorm.io/gorm"
	"selector.dev/dappas/internal/modules/ecommerce/entities"
	"selector.dev/dappas/internal/modules/ecommerce/shopify"
	"selector.dev/database"
)

type CustomersRepositoryImpl struct {
	conn   *database.Conn
	service shopify.ECommerceCustomerService
	logger *zap.Logger
}

func NewPostgresCustomersRepository(conn *database.Conn, logger *zap.Logger, s shopify.ECommerceCustomerService) *CustomersRepositoryImpl {
	return &CustomersRepositoryImpl{conn, s, logger}
}

func (r *CustomersRepositoryImpl) FindPage(page, size int) (*[]entities.Customer, *int64, error) {
	var items []entities.Customer
	var count int64
	if err := r.conn.DB.Offset((page - 1) * size).Limit(size).Find(&items).Error; err != nil {
		return nil, nil, err
	}
	if err := r.conn.DB.Model(&entities.Customer{}).Count(&count).Error; err != nil {
		return nil, nil, err
	}
	return &items, &count, nil
}

func (r *CustomersRepositoryImpl) FindById(id int64) (*entities.Customer, error) {
	var customers entities.Customer
	if err := r.conn.DB.Where("id = ?", id).First(&customers).Error; err != nil {
		return nil, err
	}
	return &customers, nil
}

func (r *CustomersRepositoryImpl) Delete(customers *entities.Customer) error {
	return r.conn.UnitOfWork(func(db *gorm.DB) error {
		return db.Delete(customers).Error
	})
}

func (r *CustomersRepositoryImpl) FindAll() (*[]entities.Customer, error) {
	var items []entities.Customer
	if err := r.conn.DB.Find(&items).Error; err != nil {
		return nil, err
	}
	return &items, nil
}

func (r *CustomersRepositoryImpl) Save(customers *entities.Customer) error {
	return r.conn.UnitOfWork(func(db *gorm.DB) error {
		spfId, err := r.service.Save(customers)
		if err != nil {
			r.logger.Error("Error saving customer to Shopify", zap.Error(err))
			return err
		}
		customers.ShopifyID = *spfId

		return db.Save(customers).Error
	})
}
