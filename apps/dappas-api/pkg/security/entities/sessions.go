package entities

import "gorm.io/gorm"

type Session struct {
	*gorm.Model
	UserID uint   `json:"user_id" gorm:"not null"`
	Token  string `json:"token" gorm:"not null;unique;<-:create"`
	User   *User  `json:"user" gorm:"foreignKey:UserID;references:ID"`
}
