package endpoints

import (
	"selector.dev/dappas/internal/modules/vendors/models"
	"selector.dev/dappas/internal/modules/vendors/usecases"
	"selector.dev/webapi"
)

type ListVendorsEndpoint struct {
	useCase usecases.IListVendorsUseCase
}

func NewListVendorsEndpoint(useCase usecases.IListVendorsUseCase) *ListVendorsEndpoint {
	return &ListVendorsEndpoint{
		useCase: useCase,
	}
}

// Handler godoc
// @Summary ListVendors
// @Description vendors vendor list_vendors
// @Tags Vendor
// @Accept json
// @Produce json
// @Param body body ListVendorsInput true "Request body"
// @Success 200 {object} ListVendorsInput
// @Failure 500 {object} ProblemDetails
// @Router /v1/vendors/vendor/ListVendors [post]
func (e *ListVendorsEndpoint) Handler(input *models.ListVendorsInput) webapi.Result {
	success, fail := e.useCase.Run(input)
	if fail != nil {
		return webapi.InternalServerError(fail)
	}
	return webapi.Ok(*success)
}
