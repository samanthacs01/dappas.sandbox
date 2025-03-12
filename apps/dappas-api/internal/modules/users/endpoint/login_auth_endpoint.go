package endpoint

import (
	"errors"

	"selector.dev/security/exceptions"
	"selector.dev/security/model"
	security "selector.dev/security/use_cases"
	"selector.dev/webapi"
)

type LoginEndpoint struct {
	useCase security.ILoginUseCase
}

func NewLoginEndpoint(useCase security.ILoginUseCase) *LoginEndpoint {
	return &LoginEndpoint{
		useCase: useCase,
	}
}

// Handler godoc
// @Summary Login
// @Description users auth login
// @Tags Auth
// @Accept json
// @Produce json
// @Param body body LoginInput true "Request body"
// @Success 200 {object} LoginOutput
// @Failure 400 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /v1/users/login [post]
func (e *LoginEndpoint) Handler(request *model.LoginInput) webapi.Result {
	if request == nil {
		err := errors.New("request body is required")
		return webapi.BadRequest(err)
	}
	success, fail := e.useCase.Run(*request)
	if fail != nil {
		if errors.Is(fail, exceptions.ErrInvalidCredentials) {
			return webapi.BadRequest(fail)
		}
		if errors.Is(fail, exceptions.ErrUserNotFound) {
			return webapi.NotFound(fail)
		}
		return webapi.InternalServerError(fail)
	}
	return webapi.Ok(*success)
}
