package repository

import (
	"selector.dev/dappas/internal/modules/vendors/entity"
)

type VendorsRepository interface {
	Save(vendors *entity.Vendor) (*int64, error)
	FindAll() ([]entity.Vendor, error)
	FindPage(page, size int) ([]entity.Vendor, int, error)
	FindById(id int64) (entity.Vendor, error)
	Update(vendors *entity.Vendor) error
	Delete(vendors *entity.Vendor) error
}
