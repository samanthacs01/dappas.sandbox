package controllers

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"go.uber.org/zap"
	"selector.dev/pulse/internal/application/dtos"
	"selector.dev/pulse/tests/mocks"
)

func TestUsersController(t *testing.T) {
	t.Run("Logout user successfully", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewISessionServices(t)
		ctrl := NewUserController(zap.L(), mocked, nil, nil)
		mocked.On("Logout", "token").Return(nil)
		input := &dtos.LogoutInput{
			Token: "token",
		}
		// Act
		success, fail := ctrl.Logout(input)
		// Assert
		assert.NotNil(t, success)
		assert.Nil(t, fail)
	})

	t.Run("Logout user fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewISessionServices(t)
		ctrl := NewUserController(zap.L(), mocked, nil, nil)
		mocked.On("Logout", "token").Return(assert.AnError)
		input := &dtos.LogoutInput{
			Token: "token",
		}
		// Act
		success, fail := ctrl.Logout(input)
		// Assert
		assert.Nil(t, success)
		assert.NotNil(t, fail)
		assert.Equal(t, 500, fail.Status)
	})
	t.Run("Delete user successfully", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewIUserService(t)
		ctrl := NewUserController(zap.L(), nil, nil, mocked)
		input := &dtos.UserDeleteInput{
			Id: 1,
		}
		mocked.On("DeleteUser", uint(input.Id)).Return(nil)

		// Act
		success, fail := ctrl.DeleteUser(input)
		// Assert
		assert.NotNil(t, success)
		assert.Nil(t, fail)
	})

	t.Run("Delete user fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewIUserService(t)
		ctrl := NewUserController(zap.L(), nil, nil, mocked)
		input := &dtos.UserDeleteInput{
			Id: 1,
		}
		mocked.On("DeleteUser", uint(input.Id)).Return(assert.AnError)
		// Act
		success, fail := ctrl.DeleteUser(input)
		// Assert
		assert.Nil(t, success)
		assert.NotNil(t, fail)
		assert.Equal(t, 500, fail.Status)
	})
}
