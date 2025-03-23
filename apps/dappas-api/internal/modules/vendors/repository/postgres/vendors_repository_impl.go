package postgres

import (
	"go.uber.org/zap"
	"selector.dev/dappas/internal/modules/vendors/entity"
	"selector.dev/dappas/internal/modules/vendors/repository"
	"selector.dev/database"
)

type vendorsRepositoryImpl struct {
	uow    database.UnitOfWork
	logger *zap.Logger
}

func NewVendorsRepository(uow database.UnitOfWork, logger *zap.Logger) repository.VendorsRepository {
	return &vendorsRepositoryImpl{uow, logger}
}

func (r *vendorsRepositoryImpl) Find() ([]entity.Vendor, error) {
	panic("implement me")
}

func (r *vendorsRepositoryImpl) FindPage(page, size int) ([]entity.Vendor, int, error) {
	panic("implement me")
}

func (r *vendorsRepositoryImpl) FindById(id int64) (entity.Vendor, error) {
	panic("implement me")
}

func (r *vendorsRepositoryImpl) Update(vendors *entity.Vendor) error {
	panic("implement me")
}

func (r *vendorsRepositoryImpl) Delete(vendors *entity.Vendor) error {
	panic("implement me")
}

func (r *vendorsRepositoryImpl) FindAll() ([]entity.Vendor, error) {
	panic("unimplemented")
}

func (r *vendorsRepositoryImpl) Save(vendors *entity.Vendor) (*int64, error) {
	var id int64
	err := r.uow.Transaction(func(db database.IQuery) error {
		qb := database.InsertInto(vendors)
		query, args := qb.Build()
		r.logger.Info("Save", zap.String("query", query), zap.Any("args", args))
		result, err := db.Save(qb)
		if err != nil {
			return err
		}
		id = result

		if vendors.Products != nil {
			for _, product := range *vendors.Products {
				product.VendorId = id
				qb := database.InsertInto(product)
				query, args := qb.Build()
				r.logger.Info("Save", zap.String("query", query), zap.Any("args", args))
				productId, err := db.Save(qb)
				if err != nil {
					return err
				}
				r.logger.Info("Save product of vendor", zap.Int64("productId", productId))
			}
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	return &id, nil
}
