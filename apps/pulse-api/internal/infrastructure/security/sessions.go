package security

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
	"go.uber.org/zap"
	"selector.dev/pulse/config"
	"selector.dev/pulse/internal/domain/shared"
	servicesShared "selector.dev/pulse/internal/domain/shared/services"
	domain "selector.dev/pulse/internal/domain/user"
)

type userService struct {
	repository domain.IUserRepository
	logger     *zap.Logger
	config     config.Config
	userId     *uint
}

func NewSessionService(repository domain.IUserRepository, logger *zap.Logger, c config.Config) servicesShared.ISessionServices {
	return &userService{
		repository: repository,
		logger:     logger,
		config:     c,
		userId:     nil,
	}
}

func (u *userService) Authenticate(email, password string) (*shared.Session, error) {
	user, err := u.repository.FindUserByEmail(email)
	if err != nil {
		u.logger.Error("Receive error while finding user will be replace by invalid credentials", zap.Error(err), zap.Any("email", email))
		return nil, domain.ErrInvalidCredentials
	}
	if !user.CheckPassword(password) {
		u.logger.Info("Password does not match")
		return nil, domain.ErrInvalidCredentials
	}
	token, exp, err := u.createToken(user.Id, user.Email, user.Role, user.EntityId)
	if err != nil {
		return nil, err
	}
	if err := u.repository.CreateNewUserSession(user.Id, token); err != nil {
		return nil, err
	}

	loggedUser := shared.LoggedUser{
		Name:  user.FirstName + " " + user.LastName,
		Email: user.Email,
		Role:  user.Role,
	}

	return &shared.Session{Token: token, Role: user.Role, ExpireIn: exp, User: loggedUser}, nil
}

func (u *userService) VerifyToken(token string, userId uint) bool {
	result := u.repository.IsValidToken(token, userId)
	if result {
		u.userId = &userId
	}
	return result
}

func (u *userService) Logout(token string) error {
	userId := u.GetUserId()
	if userId == nil {
		return domain.ErrInvalidToken
	}
	return u.repository.DeleteUserSession(token, *userId)
}

func (u *userService) GetUserId() *uint {
	return u.userId
}

func (u *userService) createToken(id uint, username string, role shared.Role, EntityId *uint) (string, int64, error) {
	var secretKey = []byte(u.config.GetSecretKey())
	var expiration = u.config.GetTokenExpiration()
	exp := time.Now().Add(time.Duration(expiration) * time.Second).Unix()

	claims := jwt.MapClaims{
		"id":       id,
		"username": username,
		"role":     role,
		"EntityId": EntityId,
		"exp":      exp,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		return "", exp, err
	}

	return tokenString, exp, nil
}
