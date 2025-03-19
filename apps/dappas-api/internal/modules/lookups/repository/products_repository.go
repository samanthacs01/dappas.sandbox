package repository

import (
	"selector.dev/dappas/internal/modules/lookups/entity"
)

type ProductsRepository interface {
	Save(productions *entity.Product) error
	FindAll() ([]entity.Product, error)
	FindPage(page, size int) ([]entity.Product, int, error)
	FindById(id int64) (entity.Product, error)
	Update(productions *entity.Product) error
	Delete(productions *entity.Product) error
}
