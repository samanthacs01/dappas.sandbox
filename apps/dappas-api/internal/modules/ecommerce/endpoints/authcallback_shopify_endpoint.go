package endpoints

import (
	"selector.dev/dappas/internal/modules/ecommerce/models"
	"selector.dev/dappas/internal/modules/ecommerce/usecases"
	"selector.dev/webapi"
)

type AuthCallbackShopifyEndpoint struct {
	useCase usecases.IShopifyAuthCallbackUseCase
}

func NewAuthCallbackShopifyEndpoint(useCase usecases.IShopifyAuthCallbackUseCase) *AuthCallbackShopifyEndpoint {
	return &AuthCallbackShopifyEndpoint{
		useCase: useCase,
	}
}

// Handler godoc
// @Summary Shopify
// @Description ecommerce install callback
// @Tags Install
// @Accept json
// @Produce json
// @Param body body ShopifyAuthCallbackInput true "Request body"
// @Success 200 {object} ShopifyAuthCallbackOutput
// @Failure 500 {object} ProblemDetails
// @Router /v1/ecommerce/shopify/auth-callback [post]
func (e *AuthCallbackShopifyEndpoint) Handler(input *models.ShopifyAuthCallbackInput) webapi.Result {
	success, fail := e.useCase.Run(input)
	if fail != nil {
		return webapi.InternalServerError(fail)
	}
	return webapi.Ok(*success)
}
