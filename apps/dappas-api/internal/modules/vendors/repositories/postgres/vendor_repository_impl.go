package postgres

import (
	"go.uber.org/zap"
	"gorm.io/gorm"
	"selector.dev/dappas/internal/modules/vendors/entities"
	"selector.dev/database"
)

type VendorRepositoryImpl struct {
	conn   *database.Conn
	logger *zap.Logger
}

func NewPostgresVendorRepository(conn *database.Conn, logger *zap.Logger) *VendorRepositoryImpl {
	return &VendorRepositoryImpl{conn, logger}
}

func (r *VendorRepositoryImpl) FindPage(page, size int) (*[]entities.Vendor, *int64, error) {
	var items []entities.Vendor
	var count int64
	if err := r.conn.DB.Offset((page - 1) * size).Limit(size).Find(&items).Error; err != nil {
		return nil, nil, err
	}
	if err := r.conn.DB.Model(&entities.Vendor{}).Count(&count).Error; err != nil {
		return nil, nil, err
	}
	return &items, &count, nil
}

func (r *VendorRepositoryImpl) FindById(id int64) (*entities.Vendor, error) {
	var vendor entities.Vendor
	if err := r.conn.DB.Where("id = ?", id).First(&vendor).Error; err != nil {
		return nil, err
	}
	return &vendor, nil
}

func (r *VendorRepositoryImpl) Delete(vendor *entities.Vendor) error {
	return r.conn.UnitOfWork(func(db *gorm.DB) error {
		return db.Delete(vendor).Error
	})
}

func (r *VendorRepositoryImpl) FindAll() (*[]entities.Vendor, error) {
	var items []entities.Vendor
	if err := r.conn.DB.Find(&items).Error; err != nil {
		return nil, err
	}
	return &items, nil
}

func (r *VendorRepositoryImpl) Save(vendor *entities.Vendor) error {
	return r.conn.UnitOfWork(func(db *gorm.DB) error {
		return db.Save(vendor).Error
	})
}
