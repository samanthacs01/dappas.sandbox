package receivables

import "errors"

var (
	ErrPayerNotFound = errors.New("payer not found")
	ErrUnauthorized  = errors.New("unauthorized")
)
