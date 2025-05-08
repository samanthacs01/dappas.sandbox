package endpoints

import (
	"selector.dev/security/models"
	"selector.dev/security/usecases"
	"selector.dev/webapi"
)

type AuthUserEndpoint struct {
	useCase usecases.ILoginUseCase
}

func NewAuthUserEndpoint(useCase usecases.ILoginUseCase) *AuthUserEndpoint {
	return &AuthUserEndpoint{
		useCase: useCase,
	}
}

// Handler godoc
// @Summary Auth user
// @Description vendors vendor list_vendors
// @Tags Users
// @Accept json
// @Produce json
// @Param body body AuthInput true "Request body"
// @Success 200 {object} AuthInput
// @Failure 500 {object} ProblemDetails
// @Router /v1/security/auth [post]
func (e *AuthUserEndpoint) Handler(input *models.AuthInput) webapi.Result {
	success, fail := e.useCase.Run(input)
	if fail != nil {
		return webapi.InternalServerError(fail)
	}
	return webapi.Ok(*success)
}
