package templates

var PostgresTmpl = `package postgres

import (
	"go.uber.org/zap"
	"gorm.io/gorm"
	"{{.Package}}/internal/modules/{{.Module}}/entities"
	"selector.dev/database"
)

type {{.Name}}RepositoryImpl struct {
	conn *database.Conn
	logger *zap.Logger
}

func NewPostgres{{.Name}}Repository(conn *database.Conn, logger *zap.Logger) *{{.Name}}RepositoryImpl {
	return &{{.Name}}RepositoryImpl{conn, logger}
}

func (r *{{.Name}}RepositoryImpl) FindPage(page, size int) (*[]entities.{{.Name}}, *int64, error) {
	var items []entities.{{.Name}}
	var count int64
	if err := r.conn.DB.Offset((page - 1) * size).Limit(size).Find(&items).Error; err != nil {
		return nil, nil, err
	}
	if err := r.conn.DB.Model(&entities.{{.Name}}{}).Count(&count).Error; err != nil {
		return nil, nil, err
	}
	return &items, &count, nil
}

func (r *{{.Name}}RepositoryImpl) FindById(id int64) (*entities.{{.Name}}, error) {
	var {{.ModuleName}} entities.{{.Name}}
	if err := r.conn.DB.Where("id = ?", id).First(&{{.ModuleName}}).Error; err != nil {
		return nil, err
	}
	return &{{.ModuleName}}, nil
}

func (r *{{.Name}}RepositoryImpl) Delete({{.ModuleName}} *entities.{{.Name}}) error {
	return r.conn.UnitOfWork(func (db *gorm.DB) error {
		return db.Delete({{.ModuleName}}).Error
	})
}
	
func (r *{{.Name}}RepositoryImpl) FindAll() (*[]entities.{{.Name}}, error) {
	var items []entities.{{.Name}}
	if err := r.conn.DB.Find(&items).Error; err != nil {
		return nil, err
	}
	return &items, nil
}

func (r *{{.Name}}RepositoryImpl) Save({{.ModuleName}} *entities.{{.Name}}) error {
	return r.conn.UnitOfWork(func (db *gorm.DB) error {
		return db.Save({{.ModuleName}}).Error
	})
}
`
