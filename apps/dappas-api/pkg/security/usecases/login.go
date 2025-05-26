package usecases

import (
	"fmt"

	"github.com/golang-jwt/jwt"
	"go.uber.org/zap"
	"selector.dev/security/config"
	"selector.dev/security/exceptions"
	"selector.dev/security/models"
	"selector.dev/security/repositories"
)

//go:generate mockgen -destination=../mocks/mock_login_use_case.go -package=mocks selector.dev/security/usecases ILoginUseCase
type ILoginUseCase interface {
	Run(input *models.AuthInput) (*models.LoginOutput, error)
}

type loginUseCase struct {
	repository       repositories.IUserRepository
	googleRepository repositories.IGoogleUserRepository
	config           config.ISecurityConfig
	logger           *zap.Logger
}

func NewLoginUseCase(repository repositories.IUserRepository, googleRepository repositories.IGoogleUserRepository, config config.ISecurityConfig, logger *zap.Logger) ILoginUseCase {
	return &loginUseCase{repository: repository, googleRepository: googleRepository, config: config, logger: logger}
}

func (uc *loginUseCase) Run(input *models.AuthInput) (*models.LoginOutput, error) {
	body, err := input.GetBody()
	if err != nil {
		uc.logger.Error("Cannot get body from input", zap.Error(err))
		return nil, err
	}
	var output *models.LoginOutput

	switch input.RequestType {
	case models.RequestTypeInternalUser:
		output, err = uc.credentialsAuth(body.(*models.CredentialsAuthInput))
	case models.RequestTypeRefreshToken:
		output, err = uc.refreshTokenAuth(body.(*models.TokenAuthInput))
	case models.RequestTypeDappas:
		output, err = uc.googleAuth("dappas", body.(*models.TokenAuthInput))
	case models.RequestTypeCustomer:
		output, err = uc.googleAuth("customer", body.(*models.TokenAuthInput))
	default:
		uc.logger.Error("Unsupported request type", zap.Any("RequestType", input.RequestType))
		return nil, exceptions.ErrUnSupportRequestType
	}
	if err != nil {
		uc.logger.Error("Error during authentication", zap.Error(err))
		return nil, err
	}
	// Save session to database
	return output, nil
}

func (uc *loginUseCase) credentialsAuth(input *models.CredentialsAuthInput) (*models.LoginOutput, error) {
	duration := uc.config.GetTokenDuration()
	secret := uc.config.GetSecretKey()
	result, err := uc.repository.FindByEmail(input.Email)
	if err != nil {
		return nil, err
	}
	if !result.VerifyPassword(input.Password) {
		uc.logger.Info("credentials not match for: ", zap.Any("Email", input.Email))
		return nil, exceptions.ErrInvalidCredentials
	}
	accessToken, refreshToken, err := result.GenerateToken(secret, "internal_user", duration)
	if err != nil {
		uc.logger.Error("Cannot generate token for: ", zap.Any("UserId", result.ID))
		return nil, err
	}
	output := &models.LoginOutput{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		TokenType:    "Bearer",
		ExpiresIn:    duration,
	}
	return output, nil
}

func (uc *loginUseCase) refreshTokenAuth(input *models.TokenAuthInput) (*models.LoginOutput, error) {
	duration := uc.config.GetTokenDuration()
	secret := uc.config.GetSecretKey()
	if err := input.Validate(); err != nil {
		uc.logger.Error("Invalid input", zap.Error(err))
		return nil, err
	}

	claims := &jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(input.Token, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(uc.config.GetSecretKey()), nil
	})

	if err != nil || !token.Valid {
		uc.logger.Error("Invalid token", zap.Error(err))
		return nil, exceptions.ErrInvalidToken
	}

	email, ok := (*claims)["sub"].(string)
	if !ok {
		uc.logger.Error("Subject (sub) not found or invalid in token claims")
		return nil, exceptions.ErrInvalidToken
	}

	user, err := uc.repository.FindByEmail(email)
	if err != nil {
		uc.logger.Error("User not found", zap.Error(err))
		return nil, exceptions.ErrUserNotFound
	}

	accessToken, refreshToken, err := user.GenerateToken(secret, "refresh_token", duration)
	if err != nil {
		return nil, err
	}

	output := &models.LoginOutput{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		TokenType:    "Bearer",
		ExpiresIn:    duration,
	}
	return output, nil
}

func (uc *loginUseCase) googleAuth(account string, input *models.TokenAuthInput) (*models.LoginOutput, error) {
	_, err := uc.googleRepository.GetUserInfo(account, input.Token)
	if err != nil {
		uc.logger.Error("Error getting user info from Google", zap.Error(err))
		return nil, err
	}
	return &models.LoginOutput{}, nil
}
