package postgres

import (
	"go.uber.org/zap"
	"selector.dev/dappas/internal/modules/lookups/entity"
	"selector.dev/dappas/internal/modules/lookups/repository"
	"selector.dev/database"
)

type productsRepositoryImpl struct {
	uow    database.UnitOfWork
	logger *zap.Logger
}

func NewProductsRepository(uow database.UnitOfWork, logger *zap.Logger) repository.ProductsRepository {
	return &productsRepositoryImpl{uow, logger}
}

func (r *productsRepositoryImpl) Find() ([]entity.Product, error) {
	panic("implement me")
}

func (r *productsRepositoryImpl) FindPage(page, size int) ([]entity.Product, int, error) {
	panic("implement me")
}

func (r *productsRepositoryImpl) FindById(id int64) (entity.Product, error) {
	panic("implement me")
}

func (r *productsRepositoryImpl) Update(products *entity.Product) error {
	panic("implement me")
}

func (r *productsRepositoryImpl) Delete(products *entity.Product) error {
	panic("implement me")
}

func (r *productsRepositoryImpl) FindAll() ([]entity.Product, error) {
	panic("unimplemented")
}

func (r *productsRepositoryImpl) Save(product *entity.Product) error {
	panic("unimplemented")
}
