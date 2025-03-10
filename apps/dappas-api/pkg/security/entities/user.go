package entities

import "selector.dev/security/config"

type User struct {
	Id           int64   `json:"id"`
	Email        string  `json:"email"`
	PasswordHash string  `json:"-"`
	Role         string  `json:"role"`
	FirstName    string  `json:"first_name"`
	LastName     string  `json:"last_name"`
	IsActive     bool    `json:"is_active"`
	CreatedAt    string  `json:"created_at"`
	UpdatedAt    string  `json:"updated_at"`
	DeletedAt    *string `json:"deleted_at"`
}

func (u *User) FullName() string {
	return u.FirstName + " " + u.LastName
}

func (u *User) VerifyPassword(password string, config config.ISecurityConfig) bool {
	return true
}

func (u *User) GenerateToken(config config.ISecurityConfig) string {
	return ""
}
