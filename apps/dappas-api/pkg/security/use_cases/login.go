package use_cases

import (
	"errors"

	"go.uber.org/zap"
	"selector.dev/security/config"
	"selector.dev/security/model"
	"selector.dev/security/repositories"
)

//go:generate mockgen -destination=../mocks/mock_login_use_case.go -package=mocks selector.dev/security/use_cases ILoginUseCase
type ILoginUseCase interface {
	Run(input model.LoginInput) (*model.LoginOutput, error)
}

type loginUseCase struct {
	repository repositories.IUserRepository
	config     config.ISecurityConfig
	logger *zap.Logger
}

func NewLoginUseCase(repository repositories.IUserRepository, config config.ISecurityConfig, logger *zap.Logger) ILoginUseCase {
	return &loginUseCase{repository: repository, config: config, logger: logger}
}

func (uc *loginUseCase) Run(input model.LoginInput) (*model.LoginOutput, error) {
	result, err := uc.repository.FindByEmail(input.Email)
	if err != nil {
		return nil, err
	}
	if !result.VerifyPassword(input.Password) {
		uc.logger.Info("credentials not match for: ", zap.Any("Email", input.Email))
		return nil, errors.New("invalid credentials")
	}
	token, err := result.GenerateToken(uc.config)
	if err != nil {
		uc.logger.Error("Cannot generate token for: ", zap.Any("UserId", result.Id))
		return nil, err
	}
	output := model.LoginOutput{
		Token: token,
	}
	return &output, nil
}
