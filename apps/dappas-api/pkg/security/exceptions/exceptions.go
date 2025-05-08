package exceptions

import "errors"

var (
	// ErrInvalidCredentials is returned when the credentials are invalid
	ErrInvalidCredentials = errors.New("invalid credentials")
	// ErrUserNotFound is returned when the user is not found
	ErrUserNotFound = errors.New("user not found")
	// ErrInvalidAuthType is returned when the auth type is invalid
	ErrUnSupportRequestType = errors.New("unsupported request type")
	// ErrInvalidToken is returned when the token is invalid
	ErrInvalidToken = errors.New("invalid token")
	ErrDecodingUserInfo = errors.New("cannot decode user info")
)
