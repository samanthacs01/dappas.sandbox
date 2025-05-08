package entities

import (
	"gorm.io/gorm"
)

type Customer struct {
	*gorm.Model
	UserID uint `json:"user_id" gorm:"not null;unique"`
}
