package services

import (
	"selector.dev/pulse/internal/domain/shared"
	"selector.dev/pulse/internal/domain/user"
)

//go:generate mockery --name=IUserManagement --output=../../../../tests/mocks --filename=user_management_services.go
type IUserManagement interface {
	InviteNewUser(email string, name string, entity *uint, role shared.Role, tokens map[string]string) error
	ActivateUser(token string, password string) error
	RecoveryPassword(email string) error
	FindUserByEmail(email string) (*user.User, error)
	SendEmailInvitation(token string, email string, role shared.Role, tokens map[string]string) error
	GenerateToken(password string) (*string, error)
}
