package user

import "selector.dev/pulse/internal/infrastructure/database/models"

//go:generate mockery --name=IUserRepository --output=../../../tests/mocks --filename=users_repository.go
type IUserRepository interface {
	FindUserByEmail(email string) (*User, error)
	CreateNewUserSession(id uint, token string) error
	IsValidToken(token string, userId uint) bool
	DeleteUserSession(token string, userId uint) error
	CreateUser(user *User) (*uint, error)
	UpdateUser(user *User) error
	FindUserByToken(token string) (*User, error)
	FindAllUsers(search UserListFilter) ([]models.ViewUser, *int64, error)
	FindUserById(id uint) (*models.ViewUser, error)
	UpdateUserData(user *User) error
	DeleteUser(id uint, userId *uint) error
}
