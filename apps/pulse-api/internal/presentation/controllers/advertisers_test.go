package controllers

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"selector.dev/pulse/internal/domain/shared"
	"selector.dev/pulse/tests/mocks"
)

func TestAdvertisersController(t *testing.T) {
	t.Run("get advertisers successfully", func(t *testing.T) {
		// Arrange
		data := []shared.Nomenclator{
			{
				Id:   "1",
				Text: "Payer 1",
			},
		}
		mocked := mocks.NewIAdvertisersRepository(t)
		ctrl := NewAdvertisersController(mocked)
		mocked.On("GetItemsAsNomenclator").Return(&data, nil)
		// Act
		result, fail := ctrl.GetItemsAsNomenclator()

		// Assert
		assert.NotNil(t, result)
		assert.Nil(t, fail)
	})

	t.Run("get advertisers fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewIAdvertisersRepository(t)
		ctrl := NewAdvertisersController(mocked)
		mocked.On("GetItemsAsNomenclator").Return(nil, assert.AnError)
		// Act
		result, fail := ctrl.GetItemsAsNomenclator()

		// Assert
		assert.Nil(t, result)
		assert.NotNil(t, fail)
		assert.Equal(t, 500, fail.Status)
	})
}
