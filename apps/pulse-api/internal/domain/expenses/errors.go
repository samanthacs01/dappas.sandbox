package expenses

import "errors"

var (
	ErrExpenseNotFound   = errors.New("expense not found")
	ErrExpenseNotCreated = errors.New("expense not created")

	ErrExpenseAfterAppliedRetentions = errors.New("you cannot add or modify expenses, was applied retentions on paid bill")
)
