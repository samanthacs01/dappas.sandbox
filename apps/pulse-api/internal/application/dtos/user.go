package dtos

import (
	"selector.dev/pulse/internal/domain/shared"
	"selector.dev/webapi"
)

type AuthCredentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
} //@name Credentials

type LogoutInput struct {
	Token  string `header:"Authorization"`
	Accept string `header:"accept"`
} //@name LogoutInput

type ChangePasswordInput struct {
	Password          string `json:"password"`
	ConfirmationToken string `json:"token"`
} // @name ChangePasswordInput

type RecoveryPasswordInput struct {
	Email string `form:"email"`
} // @name RecoveryPasswordInput

type User struct {
	Id        uint        `json:"id"`
	FirstName string      `json:"first_name"`
	LastName  string      `json:"last_name"`
	Email     string      `json:"email"`
	Role      shared.Role `json:"role"`
	Status    bool        `json:"status"`
} // @name User

type Users ListResponse[User] // @name Users

type UserFilterInput struct {
	Role   webapi.CSStringList `form:"role"`
	Status *bool               `form:"status"`
	Search *string             `form:"q"`
	Sorts  webapi.OrderBy      `form:"sort"`
	*PaginatingInput
} // @name UserFilterInput

type UsersByIdInput GetByIdInput[int] // @name UsersByIdInput
type UserDeleteInput DeleteInput[int] //@name UserDeleteInput

type CreateUserInput struct {
	FirstName string      `json:"first_name"`
	LastName  string      `json:"last_name"`
	Email     string      `json:"email"`
	Role      shared.Role `json:"role"`
} //@name CreateUserInput

type UpdateUserInput struct {
	Id        uint        `uri:"id" binding:"required" json:"-"`
	FirstName string      `json:"first_name"`
	LastName  string      `json:"last_name"`
	Role      shared.Role `json:"role"`
} //@name UpdateUserInput
