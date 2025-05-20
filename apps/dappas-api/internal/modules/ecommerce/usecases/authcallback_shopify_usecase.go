package usecases

import (
	"errors"

	"selector.dev/dappas/internal/modules/ecommerce/models"
)

//go:generate mockgen -destination=../mocks/mock_auth_callback_shopify_usecase.go -package=mocks selector.dev/dappas/internal/modules/ecommerce/usecases IShopifyAuthCallbackUseCase
type IShopifyAuthCallbackUseCase interface {
	Run(input *models.ShopifyAuthCallbackInput) (*models.ShopifyAuthCallbackOutput, error)
}

type shopifyAuthCallbackUseCase struct {
}

func NewShopifyAuthCallbackUseCase() IShopifyAuthCallbackUseCase {
	return &shopifyAuthCallbackUseCase{}
}

func (u *shopifyAuthCallbackUseCase) Run(input *models.ShopifyAuthCallbackInput) (*models.ShopifyAuthCallbackOutput, error) {
	return nil, errors.New("not implemented")
}
