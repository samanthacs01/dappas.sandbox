package services

import "selector.dev/pulse/internal/domain/shared"

//go:generate mockery --name=ISessionServices --output=../../../../tests/mocks --filename=session_services.go
type ISessionServices interface {
	Authenticate(email, password string) (*shared.Session, error)
	VerifyToken(token string, userId uint) bool
	GetUserId() *uint
	Logout(token string) error
}
