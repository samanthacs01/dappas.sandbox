package entities

import (
	"gorm.io/gorm"
)

type Vendor struct {
	*gorm.Model
	Name string `json:"name" gorm:"type:varchar(255);not null;unique"`
}
