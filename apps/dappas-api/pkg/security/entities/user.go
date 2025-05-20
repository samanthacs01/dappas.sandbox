package entities

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	*gorm.Model
	Email      string `json:"email" gorm:"unique;not null"`
	FirstName  string `json:"first_name" gorm:"not null"`
	LastName   string `json:"last_name" gorm:"not null"`
	Phone      *string `json:"phone" gorm:"null"`
	Password   string `json:"password" gorm:"null"` // Null for social network users
	Role       string `json:"role" gorm:"not null"`
	IsExternal bool   `json:"is_external" gorm:"default:false"` // True for social network users
	Provider   string `json:"provider" gorm:"null"`             // e.g., "google", "facebook"
	ProviderID string `json:"provider_id" gorm:"unique;null"`   // ID from the social network provider
}

type Claims struct {
	Subject string `json:"sub"`
	jwt.RegisteredClaims
}

func (u *User) VerifyPassword(password string) bool {
	bytes := []byte(password)
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), bytes)
	fmt.Println("err", err)
	return err == nil
}

func (u *User) GenerateToken(secret, issuer string, duration int) (string, string, error) {
	var secretKey = []byte(secret)

	exp := time.Now().Add(time.Duration(duration) * time.Second).Unix()

	claims := &Claims{
		Subject: u.Email,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    issuer,
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Unix(exp, 0)),
		},
	}

	accessToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(secretKey)
	if err != nil {
		return "", "", err
	}
	
	refreshClaims := Claims{
		Subject: u.Email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(30 * 24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	
	refreshToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims).SignedString(secretKey)
	if err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}
