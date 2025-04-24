package expenses

//go:generate mockery --name=IExpensesRepository --output=../../../tests/mocks --filename=expenses_repository.go
type IExpensesRepository interface {
	FindAllExpenses(productions *[]int, months *[]string, from string, to string, limit *int, offset *int, sortBy []struct{ Field, Direction string }) (*[]Expense, *int64, error)
	CreateExpense(e *Expense, docs []ExpenseDoc) (*Expense, error)
	DeleteExpense(id uint) error
	FindExpenseById(id uint) (*Expense, *[]ExpenseDoc, error)
	UpdateExpense(e *Expense, newDocs []ExpenseDoc, deleteFiles []int) (*Expense, error)
}
