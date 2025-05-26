package usecases

import (
	"testing"

	"github.com/stretchr/testify/assert"
	gomock "go.uber.org/mock/gomock"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
	"selector.dev/security/entities"
	"selector.dev/security/exceptions"
	"selector.dev/security/mocks"
	"selector.dev/security/models"
)

func TestLoginUsecase(t *testing.T) {
	controller := gomock.NewController(t)
	repository := mocks.NewMockIUserRepository(controller)
	config := mocks.NewMockISecurityConfig(controller)
	email := "fakeuser@fake.com"
	t.Run("Login Usecase when run with valid data return success", func(t *testing.T) {
		// Arrange

		hashPassword, err := bcrypt.GenerateFromPassword([]byte("password"), bcrypt.DefaultCost)
		if err != nil {
			t.Fatalf("failed to generate password hash: %v", err)
		}
		input := models.AuthInput{
			RequestType: models.RequestTypeInternalUser,
			Body: map[string]any{
				"email":    email,
				"password": "password",
			},
		}
		repository.EXPECT().FindByEmail(email).Return(&entities.User{Email: email, Password: string(hashPassword)}, nil)
		config.EXPECT().GetSecretKey().Return("secret")
		config.EXPECT().GetTokenDuration().Return(3600)

		useCase := NewLoginUseCase(repository, nil, config, zap.L())
		// act
		output, err := useCase.Run(&input)
		// assert
		assert.Nil(t, err)
		assert.NotNil(t, output)
	})
	t.Run("Login Usecase when run with invalid data return error", func(t *testing.T) {
		// Arrange
		hashPassword, err := bcrypt.GenerateFromPassword([]byte("password"), bcrypt.DefaultCost)
		if err != nil {
			t.Fatalf("failed to generate password hash: %v", err)
		}
		input := models.AuthInput{
			RequestType: models.RequestTypeInternalUser,
			Body: map[string]any{
				"email":    email,
				"password": "passwordError",
			},
		}
		repository.EXPECT().FindByEmail(email).Return(&entities.User{Email: email, Password: string(hashPassword)}, nil)
		config.EXPECT().GetSecretKey().Return("secret")
		config.EXPECT().GetTokenDuration().Return(3600)

		useCase := NewLoginUseCase(repository, nil, config, zap.L())
		// act
		output, err := useCase.Run(&input)
		// assert
		assert.NotNil(t, err)
		assert.Nil(t, output)
	})

	t.Run("Login Usecase when run with not found user", func(t *testing.T) {
		// Arrange
		input := models.AuthInput{
			RequestType: models.RequestTypeInternalUser,
			Body: map[string]any{
				"email":    email,
				"password": "password",
			},
		}
		repository.EXPECT().FindByEmail(email).Return(nil, exceptions.ErrUserNotFound)
		config.EXPECT().GetSecretKey().Return("secret")
		config.EXPECT().GetTokenDuration().Return(3600)

		useCase := NewLoginUseCase(repository, nil, config, zap.L())
		// act
		output, err := useCase.Run(&input)
		// assert
		assert.NotNil(t, err)
		assert.Nil(t, output)
	})
}
