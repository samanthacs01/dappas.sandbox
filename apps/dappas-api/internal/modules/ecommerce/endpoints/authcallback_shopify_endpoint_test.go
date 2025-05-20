package endpoints

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"go.uber.org/mock/gomock"
	"selector.dev/dappas/internal/modules/ecommerce/mocks"
	"selector.dev/dappas/internal/modules/ecommerce/models"
)

func TestCallback(t *testing.T) {
	ctrl := gomock.NewController(t)
	t.Run("Callback successfully", func(t *testing.T) {
		// Arrange
		input := &models.ShopifyAuthCallbackInput{}
		mocked := mocks.NewMockIShopifyAuthCallbackUseCase(ctrl)
		mocked.EXPECT().Run(input).Return(&models.ShopifyAuthCallbackOutput{}, nil)
		ep := NewAuthCallbackShopifyEndpoint(mocked)
		// Act
		result := ep.Handler(input)
		// Assert
		assert.NotNil(t, result)
		assert.Equal(t, 200, result.Status)
	})

	t.Run("Callback fails", func(t *testing.T) {
		// Arrange
		input := &models.ShopifyAuthCallbackInput{}
		mocked := mocks.NewMockIShopifyAuthCallbackUseCase(ctrl)
		mocked.EXPECT().Run(input).Return(nil, errors.New("not implemented"))
		ep := NewAuthCallbackShopifyEndpoint(mocked)
		// Act
		result := ep.Handler(input)
		// Assert
		assert.NotNil(t, result)
		assert.Equal(t, 500, result.Status)
	})
}
