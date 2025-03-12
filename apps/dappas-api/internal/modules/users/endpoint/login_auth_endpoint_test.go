package endpoint

import (
	"errors"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
	"go.uber.org/mock/gomock"
	"selector.dev/security/exceptions"
	"selector.dev/security/mocks"
	"selector.dev/security/model"
)

func TestLogin(t *testing.T) {
	controller := gomock.NewController(t)
	t.Run("Login successfully", func(t *testing.T) {
		// Arrange
		input := model.LoginInput{}
		mocked := mocks.NewMockILoginUseCase(controller)
		mocked.EXPECT().Run(input).Return(&model.LoginOutput{}, nil)
		ep := NewLoginEndpoint(mocked)
		// Act
		result := ep.Handler(&input)
		// Assert
		assert.NotNil(t, result)
		assert.Equal(t, http.StatusOK, result.Status)
	})

	t.Run("Login fails", func(t *testing.T) {
		// Arrange
		input := model.LoginInput{}
		mocked := mocks.NewMockILoginUseCase(controller)
		mocked.EXPECT().Run(input).Return(nil, errors.New("not implemented"))
		ep := NewLoginEndpoint(mocked)
		// Act
		result := ep.Handler(&input)
		// Assert
		assert.NotNil(t, result)
		assert.Equal(t, http.StatusInternalServerError, result.Status)
	})

	t.Run("Login fails when credentials are not correct", func(t *testing.T) {
		// Arrange
		input := model.LoginInput{}
		mocked := mocks.NewMockILoginUseCase(controller)
		mocked.EXPECT().Run(input).Return(nil, exceptions.ErrInvalidCredentials)
		ep := NewLoginEndpoint(mocked)
		// Act
		result := ep.Handler(&input)
		// Assert
		assert.NotNil(t, result)
		assert.Equal(t, http.StatusBadRequest, result.Status)
	})

	t.Run("Login fails when user is not found", func(t *testing.T) {
		// Arrange
		input := model.LoginInput{}
		mocked := mocks.NewMockILoginUseCase(controller)
		mocked.EXPECT().Run(input).Return(nil, exceptions.ErrUserNotFound)
		ep := NewLoginEndpoint(mocked)
		// Act
		result := ep.Handler(&input)
		// Assert
		assert.NotNil(t, result)
		assert.Equal(t, http.StatusNotFound, result.Status)
	})

	t.Run("Login fails when input is empty", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewMockILoginUseCase(controller)
		//mocked.EXPECT().Run().Return(nil, errors.New("not implemented"))
		ep := NewLoginEndpoint(mocked)
		// Act
		result := ep.Handler(nil)
		// Assert
		assert.NotNil(t, result)
		assert.Equal(t, http.StatusBadRequest, result.Status)
	})
}
