package entities

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"selector.dev/security/config"
)

type User struct {
	Id           int64   `json:"id" db:"id"`
	Email        string  `json:"email" db:"email"`
	Password 	 string  `json:"-" db:"password"`
	Role         string  `json:"role" db:"role"`
	FirstName    string  `json:"first_name" db:"first_name"`
	LastName     string  `json:"last_name" db:"last_name"`
	IsActive     bool    `json:"is_active" db:"is_active"`
}

func (u *User) FullName() string {
	return u.FirstName + " " + u.LastName
}

func (u *User) VerifyPassword(password string) bool {
	bytes := []byte(password)
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), bytes)
	return err == nil
}

func (u *User) GenerateToken(config config.ISecurityConfig) (string, error) {
	var secretKey = []byte(config.GetSecretKey())
	var duration = config.GetTokenDuration()
	exp := time.Now().Add(time.Duration(duration) * time.Second).Unix()

	claims := jwt.MapClaims{
		"id":       u.Id,
		"username": u.Email,
		"role":     u.Role,
		"exp":      exp,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
