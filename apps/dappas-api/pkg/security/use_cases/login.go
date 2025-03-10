package use_cases

import (
	"errors"

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
}

func NewLoginUseCase(repository repositories.IUserRepository, config config.ISecurityConfig) ILoginUseCase {
	return &loginUseCase{repository: repository, config: config}
}

func (uc *loginUseCase) Run(input model.LoginInput) (*model.LoginOutput, error) {
	result, err := uc.repository.FindByEmail(input.Email)
	if err != nil {
		return nil, err
	}
	if !result.VerifyPassword(input.Password, uc.config) {
		return nil, errors.New("invalid credentials")
	}
	output := model.LoginOutput{
		Token: result.GenerateToken(uc.config),
	}
	return &output, nil
}
