package endpoints

import (
	"selector.dev/dappas/internal/modules/ecommerce/models"
	"selector.dev/dappas/internal/modules/ecommerce/usecases"
	"selector.dev/webapi"
)

type InstallShopifyEndpoint struct {
	useCase usecases.IShopifyInstallUseCase
}

func NewShopifyInstallEndpoint(useCase usecases.IShopifyInstallUseCase) *InstallShopifyEndpoint {
	return &InstallShopifyEndpoint{
		useCase: useCase,
	}
}

// Handler godoc
// @Summary Shopify
// @Description ecommerce install install
// @Tags E-Commerce
// @Accept json
// @Produce json
// @Param body body InstallInput true "Request body"
// @Success 200 {object} InstallInput
// @Failure 500 {object} ProblemDetails
// @Router /v1/ecommerce/shopify/install [post]
func (e *InstallShopifyEndpoint) Handler(input *models.InstallInput) webapi.Result {
	success, fail := e.useCase.Run(input)
	if fail != nil {
		return webapi.InternalServerError(fail)
	}
	return webapi.Redirect(success.Url)
}
