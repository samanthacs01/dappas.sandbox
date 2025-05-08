package endpoints

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"go.uber.org/mock/gomock"
	"selector.dev/dappas/internal/modules/vendors/mocks"
	"selector.dev/dappas/internal/modules/vendors/models"
)

func TestListVendors(t *testing.T) {
	ctrl := gomock.NewController(t)
	t.Run("ListVendors successfully", func(t *testing.T) {
		// Arrange
		input := &models.ListVendorsInput{}
		mocked := mocks.NewMockIListVendorsUseCase(ctrl)
		mocked.EXPECT().Run(input).Return(&models.ListVendorsOutput{}, nil)
		ep := NewListVendorsEndpoint(mocked)
		// Act
		result := ep.Handler(input)
		// Assert
		assert.NotNil(t, result)
		assert.Equal(t, 200, result.Status)
	})

	t.Run("ListVendors fails", func(t *testing.T) {
		// Arrange
		input := &models.ListVendorsInput{}
		mocked := mocks.NewMockIListVendorsUseCase(ctrl)
		mocked.EXPECT().Run(input).Return(nil, errors.New("not implemented"))
		ep := NewListVendorsEndpoint(mocked)
		// Act
		result := ep.Handler(input)
		// Assert
		assert.NotNil(t, result)
		assert.Equal(t, 500, result.Status)
	})
}
