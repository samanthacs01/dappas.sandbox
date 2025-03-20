package endpoint

import (
	"selector.dev/dappas/internal/modules/vendors/model"
	"selector.dev/dappas/internal/modules/vendors/usecase"
	"selector.dev/webapi"
)

type SaveEndpoint struct {
	useCase usecase.ISaveUseCase
}

func NewSaveEndpoint(useCase usecase.ISaveUseCase) *SaveEndpoint {
	return &SaveEndpoint{
		useCase: useCase,
	}
}

// Handler godoc
// @Summary Save
// @Description vendors save
// @Tags Vendors
// @Accept json
// @Produce json
// @Param body body SaveVendorInput true "Request body"
// @Success 200 {object} SaveVendorOutput
// @Failure 500 {object} ProblemDetails
// @Router /v1/vendors/save [post]
func (e *SaveEndpoint) Handler(input *model.SaveInput) webapi.Result {
	success, fail := e.useCase.Run(input)
	if fail != nil {
		return webapi.InternalServerError(fail)
	}
	return webapi.Ok(*success)
}
