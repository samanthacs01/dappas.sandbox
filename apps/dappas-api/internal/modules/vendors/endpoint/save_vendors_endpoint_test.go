package endpoint

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"go.uber.org/mock/gomock"
	"selector.dev/dappas/internal/modules/vendors/mocks"
	"selector.dev/dappas/internal/modules/vendors/model"
)

func TestSave(t *testing.T) {
	ctrl := gomock.NewController(t)
	t.Run("Save successfully", func(t *testing.T) {
		// Arrange
		input := &model.SaveInput{}
		mocked := mocks.NewMockISaveUseCase(ctrl)
		mocked.EXPECT().Run(input).Return(&model.SaveOutput{}, nil)
		ep := NewSaveEndpoint(mocked)
		// Act
		result := ep.Handler(input)
		// Assert
		assert.NotNil(t, result)
		assert.Equal(t, 200, result.Status)
	})

	t.Run("Save fails", func(t *testing.T) {
		// Arrange
		input := &model.SaveInput{}
		mocked := mocks.NewMockISaveUseCase(ctrl)
		mocked.EXPECT().Run(input).Return(nil, errors.New("not implemented"))
		ep := NewSaveEndpoint(mocked)
		// Act
		result := ep.Handler(input)
		// Assert
		assert.NotNil(t, result)
		assert.Equal(t, 500, result.Status)
	})
}
