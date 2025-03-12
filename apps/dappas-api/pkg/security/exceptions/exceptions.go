package exceptions

import "errors"

var (
	// ErrInvalidCredentials is returned when the credentials are invalid
	ErrInvalidCredentials = errors.New("invalid credentials")
	// ErrUserNotFound is returned when the user is not found
	ErrUserNotFound = errors.New("user not found")
)
