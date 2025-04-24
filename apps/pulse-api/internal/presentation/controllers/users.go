package controllers

import (
	"errors"
	"strings"

	"go.uber.org/zap"

	dtos "selector.dev/pulse/internal/application/dtos"
	us "selector.dev/pulse/internal/application/services"
	"selector.dev/pulse/internal/domain/shared"
	"selector.dev/pulse/internal/domain/shared/services"
	domain "selector.dev/pulse/internal/domain/user"
	"selector.dev/webapi"
)

type UsersController interface {
	Auth(input *dtos.AuthCredentials) (*webapi.Result[shared.Session], *webapi.Failure)
	ChangePasswordUser(input *dtos.ChangePasswordInput) (*webapi.Result[interface{}], *webapi.Failure)
	RecoveryPassword(input *dtos.RecoveryPasswordInput) (*webapi.Result[interface{}], *webapi.Failure)
	Logout(input *dtos.LogoutInput) (*webapi.Result[interface{}], *webapi.Failure)
	GetUsers(input *dtos.UserFilterInput) (*webapi.Result[dtos.Users], *webapi.Failure)
	GetUserById(input *dtos.UsersByIdInput) (*webapi.Result[dtos.User], *webapi.Failure)
	ResendEmail(input *dtos.UsersByIdInput) (*webapi.Result[interface{}], *webapi.Failure)
	CreateUser(input *dtos.CreateUserInput) (*webapi.Result[dtos.CreatedOutput], *webapi.Failure)
	UpdateUser(input *dtos.UpdateUserInput) (*webapi.Result[dtos.User], *webapi.Failure)
	DeleteUser(input *dtos.UserDeleteInput) (*webapi.Result[interface{}], *webapi.Failure)
}

type usersController struct {
	l *zap.Logger
	s services.ISessionServices
	m services.IUserManagement
	u us.IUserService
}

func NewUserController(l *zap.Logger, s services.ISessionServices, m services.IUserManagement, u us.IUserService) UsersController {
	return &usersController{
		l: l,
		s: s,
		m: m,
		u: u,
	}
}

// Auth godoc
// @Summary Authenticate user
// @Description Authenticate user
// @Tags security
// @Accept  json
// @Produce  json
// @Param credentials body dtos.AuthCredentials true "Credentials"
// @Success 200 {object} shared.Session
// @Failure 400 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /security/auth [post]
func (c *usersController) Auth(input *dtos.AuthCredentials) (*webapi.Result[shared.Session], *webapi.Failure) {
	c.l.Info("Authenticating user", zap.String("email", input.Email))
	auth, err := c.s.Authenticate(input.Email, input.Password)
	if err != nil {
		c.l.Error("Error authenticating user", zap.Error(err))
		if errors.Is(err, domain.ErrInvalidCredentials) {
			fail := webapi.BadRequest(err)
			return nil, &fail
		}
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	ok := webapi.Ok(*auth)
	return &ok, nil
}

// ChangePasswordUser godoc
// @Summary Change password of user
// @Description Change password of user
// @Tags users
// @Accept  json
// @Produce  json
// @Param input body dtos.ChangePasswordInput true "Change password"
// @Success 204 "it is ok"
// @Failure 400 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /users/change_password [post]
func (c *usersController) ChangePasswordUser(input *dtos.ChangePasswordInput) (*webapi.Result[interface{}], *webapi.Failure) {
	c.l.Info("Changing password of user", zap.Any("input", input))
	if err := c.m.ActivateUser(input.ConfirmationToken, input.Password); err != nil {
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	success := webapi.NoContent()
	return &success, nil
}

// RecoveryPassword godoc
// @Summary Recovery password
// @Description Recovery password
// @Tags users
// @Accept  json
// @Produce  json
// @Param input body dtos.RecoveryPasswordInput true "Recovery password"
// @Success 204 "it is ok"
// @Failure 400 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /users/recovery [post]
func (c *usersController) RecoveryPassword(input *dtos.RecoveryPasswordInput) (*webapi.Result[interface{}], *webapi.Failure) {
	if err := c.m.RecoveryPassword(input.Email); err != nil {
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	success := webapi.NoContent()
	return &success, nil
}

// Logout godoc
// @Summary Logout
// @Description Logout
// @Tags security
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Success 204 "it is ok"
// @Failure 400 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /security/logout [delete]
func (c *usersController) Logout(input *dtos.LogoutInput) (*webapi.Result[interface{}], *webapi.Failure) {
	token := strings.Replace(input.Token, "Bearer ", "", 1)
	if err := c.s.Logout(token); err != nil {
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	success := webapi.NoContent()
	return &success, nil
}

// GetUsers godoc
// @Summary Get all users
// @Description Get all users
// @Tags users
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param page query int false "Page"
// @Param page_size query int false "Page size"
// @Param q query string false "Search"
// @Param status query bool false "Status"
// @Param sort query []string false "Sort"
// @Success 200 {object} Users
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /users [get]
func (c *usersController) GetUsers(input *dtos.UserFilterInput) (*webapi.Result[dtos.Users], *webapi.Failure) {
	c.l.Info("Getting users", zap.Any("input", input))
	items, err := c.u.GetUsers(input)
	if err != nil {
		if errors.Is(err, domain.ErrUserNotFound) {
			notFound := webapi.NotFound(err)
			return nil, &notFound
		}
		internalError := webapi.InternalServerError(err)
		return nil, &internalError
	}

	result := webapi.Ok(*items)
	return &result, nil
}

// GetUserById godoc
// @Summary Get a user by Id
// @Description Get a user by Id
// @Tags users
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param id path int true "User ID"
// @Success 200 {object} User
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /users/{id} [get]
func (c *usersController) GetUserById(input *dtos.UsersByIdInput) (*webapi.Result[dtos.User], *webapi.Failure) {
	c.l.Info("Get user by id", zap.Any("input", input))
	user, err := c.u.GetUserById(uint(input.Id))
	if err != nil {
		c.l.Error("Get user by id", zap.Error(err))
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}

	success := webapi.Ok(*user)
	return &success, nil
}

// ResendEmail godoc
// @Summary Resend email
// @Description Resend email
// @Tags users
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param id path int true "User ID"
// @Success 204 "it is ok"
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /users/{id}/resend_email [post]
func (c *usersController) ResendEmail(input *dtos.UsersByIdInput) (*webapi.Result[interface{}], *webapi.Failure) {
	c.l.Info("Resend email", zap.Any("input", input))
	err := c.u.ResendEmail(uint(input.Id))
	if err != nil {
		c.l.Error("Resend email failed", zap.Error(err))
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}

	result := webapi.NoContent()
	return &result, nil
}

// CreateUser godoc
// @Summary Create a new user
// @Description Create a new user
// @Tags users
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param input body CreateUserInput true "Create user input"
// @Success 201 {object} dtos.CreatedOutput
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /users [post]
func (c *usersController) CreateUser(input *dtos.CreateUserInput) (*webapi.Result[dtos.CreatedOutput], *webapi.Failure) {
	c.l.Info("Get user by id", zap.Any("input", input))
	created, err := c.u.CreateUser(input)
	if err != nil {
		c.l.Error("Error creating user", zap.Error(err))
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	success := webapi.Created(*created)
	return &success, nil
}

// UpdateUser godoc
// @Summary Update a user
// @Description Update a user
// @Tags users
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param id path int true "User ID"
// @Param input body UpdateUserInput true "User data to update"
// @Success 200 {object} User
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /users/{id} [patch]
func (c *usersController) UpdateUser(input *dtos.UpdateUserInput) (*webapi.Result[dtos.User], *webapi.Failure) {
	c.l.Info("Update user", zap.Any("input", input))
	updated, err := c.u.UpdateUser(input)
	if err != nil {
		c.l.Error("Error updating user", zap.Error(err))
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}

	success := webapi.Ok(*updated)
	return &success, nil
}

// DeleteUser godoc
// @Summary Delete a user
// @Description Delete a user
// @Tags users
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Param id path int true "User ID"
// @Success 204 "it is ok"
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /users/{id} [delete]
func (c *usersController) DeleteUser(input *dtos.UserDeleteInput) (*webapi.Result[interface{}], *webapi.Failure) {
	c.l.Info("Deleting user", zap.Any("input", input))

	err := c.u.DeleteUser(uint(input.Id))
	if err != nil {
		c.l.Error("Error deleting user", zap.Error(err))
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}

	success := webapi.NoContent()
	return &success, nil
}
