package use_cases

import (
	"testing"

	"github.com/stretchr/testify/assert"
	gomock "go.uber.org/mock/gomock"
	"selector.dev/security/entities"
	"selector.dev/security/mocks"
	"selector.dev/security/model"
)

func TestLoginUsecase(t *testing.T) {
	controller := gomock.NewController(t)
	t.Run("Login Usecase when run with valid data return success", func(t *testing.T) {
		// Arrange
		repository := mocks.NewMockIUserRepository(controller)
		config := mocks.NewMockISecurityConfig(controller)
		input := model.LoginInput{Email: "test@gmail.com", Password: "1234"}

		repository.EXPECT().FindByEmail(input.Email).Return(entities.User{}, config)
		config.EXPECT().GetSecretKey().Return("secret")

		useCase := NewLoginUseCase(repository, config)
		// act
		output, err := useCase.Run(input)
		// assert
		assert.Nil(t, err)
		assert.NotNil(t, output)
	})
}
