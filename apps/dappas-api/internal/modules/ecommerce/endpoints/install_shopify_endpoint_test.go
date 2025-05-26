package endpoints

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"go.uber.org/mock/gomock"
	"selector.dev/dappas/internal/modules/ecommerce/mocks"
	"selector.dev/dappas/internal/modules/ecommerce/models"
)

func TestInstall(t *testing.T) {
	ctrl := gomock.NewController(t)
	t.Run("Install successfully", func(t *testing.T) {
		// Arrange
		input := &models.InstallInput{}
		mocked := mocks.NewMockIShopifyInstallUseCase(ctrl)
		mocked.EXPECT().Run(input).Return(&models.InstallOutput{}, nil)
		ep := NewShopifyInstallEndpoint(mocked)
		// Act
		result := ep.Handler(input)
		// Assert
		assert.NotNil(t, result)
		assert.Equal(t, 302, result.Status)
	})

	t.Run("Install fails", func(t *testing.T) {
		// Arrange
		input := &models.InstallInput{}
		mocked := mocks.NewMockIShopifyInstallUseCase(ctrl)
		mocked.EXPECT().Run(input).Return(nil, errors.New("not implemented"))
		ep := NewShopifyInstallEndpoint(mocked)
		// Act
		result := ep.Handler(input)
		// Assert
		assert.NotNil(t, result)
		assert.Equal(t, 500, result.Status)
	})
}
