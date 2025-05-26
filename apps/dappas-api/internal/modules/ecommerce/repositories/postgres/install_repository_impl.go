package postgres

import (
	"go.uber.org/zap"
	"gorm.io/gorm"
	"selector.dev/dappas/internal/modules/ecommerce/entities"
	"selector.dev/database"
)

type InstallRepositoryImpl struct {
	conn *database.Conn
	logger *zap.Logger
}

func NewPostgresInstallRepository(conn *database.Conn, logger *zap.Logger) *InstallRepositoryImpl {
	return &InstallRepositoryImpl{conn, logger}
}

func (r *InstallRepositoryImpl) FindPage(page, size int) (*[]entities.Install, *int64, error) {
	var items []entities.Install
	var count int64
	if err := r.conn.DB.Offset((page - 1) * size).Limit(size).Find(&items).Error; err != nil {
		return nil, nil, err
	}
	if err := r.conn.DB.Model(&entities.Install{}).Count(&count).Error; err != nil {
		return nil, nil, err
	}
	return &items, &count, nil
}

func (r *InstallRepositoryImpl) FindById(id int64) (*entities.Install, error) {
	var install entities.Install
	if err := r.conn.DB.Where("id = ?", id).First(&install).Error; err != nil {
		return nil, err
	}
	return &install, nil
}

func (r *InstallRepositoryImpl) Delete(install *entities.Install) error {
	return r.conn.UnitOfWork(func (db *gorm.DB) error {
		return db.Delete(install).Error
	})
}
	
func (r *InstallRepositoryImpl) FindAll() (*[]entities.Install, error) {
	var items []entities.Install
	if err := r.conn.DB.Find(&items).Error; err != nil {
		return nil, err
	}
	return &items, nil
}

func (r *InstallRepositoryImpl) Save(install *entities.Install) error {
	return r.conn.UnitOfWork(func (db *gorm.DB) error {
		return db.Save(install).Error
	})
}
