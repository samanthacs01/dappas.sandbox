package entities

import (
	"gorm.io/gorm"
	security "selector.dev/security/entities"
)

type Customer struct {
	*gorm.Model
	UserID uint `json:"user_id" gorm:"not null;unique"`
	ShopifyID uint64 `json:"shopify_id" gorm:"not null;unique"`
	User *security.User `json:"user" gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE;"`
}
