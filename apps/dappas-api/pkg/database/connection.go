package database

import (
	"context"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Conn struct {
	DB *gorm.DB
}

type DoWork func(db *gorm.DB) error
type Mapping func(map[string]interface{}) interface{}

func InitGormConnection(ctx context.Context, connectionString string) (*Conn, error) {
	DB, err := gorm.Open(postgres.Open(connectionString), &gorm.Config{})
	if err != nil {
		return nil, err
	}
	conn := &Conn{
		DB: DB,
	}
	return conn, nil
}


func (c *Conn) UnitOfWork(txFunc DoWork) error {
	c.DB.Begin()
	db := c.DB.Begin()
	
	defer db.Rollback()
	
	if err := txFunc(db); err != nil {
		return err
	}
	db.Commit()	
	return nil
}