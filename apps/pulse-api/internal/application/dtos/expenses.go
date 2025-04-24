package dtos

import (
	"mime/multipart"

	"selector.dev/pulse/internal/domain/expenses"
	"selector.dev/webapi"
)

type ExpenseDetails struct {
	*expenses.Expense
	Files []expenses.ExpenseDoc `json:"files"`
} //@name Expense

type CreateExpenseInput struct {
	Month          string                  `form:"month"`
	TotalDeduction float64                 `form:"total_deduction"`
	ProductionId   uint                    `form:"production_id"`
	Files          []*multipart.FileHeader `form:"files" swaggerignore:"true"`
} //@name CreateExpenseInput

type ExpenseFilterInput struct {
	*PaginatingInput
	Productions webapi.CSIntList    `form:"productions"`
	MonthYear   webapi.CSStringList `form:"months"`
	Sort        webapi.OrderBy      `form:"sort"`
} //@name ExpenseFilterInput

func (i *ExpenseFilterInput) Paginate() (int, int) {
	if i.PaginatingInput != nil {
		return i.PaginatingInput.Paginate()
	}
	return 1, 15
}

type ProductionCollectionExpenseFilterInput struct {
	*PaginatingInput
	Token        string         `header:"Authorization" swaggerignore:"true"`
	ProductionId *uint          `form:"p_id"`
	From         string         `form:"from"`
	To           string         `form:"to"`
	Sort         webapi.OrderBy `form:"sort"`
} //@name ExpenseFilterInput

func (i *ProductionCollectionExpenseFilterInput) Paginate() (int, int) {
	if i.PaginatingInput != nil {
		return i.PaginatingInput.Paginate()
	}
	return 1, 15
}

type Expenses ListResponse[expenses.Expense] //@name Expenses

type DeleteExpenseOutput struct {
	Id uint `json:"id"`
} //@name DeleteExpenseOutput

type DeleteExpenseInput struct {
	Id uint `uri:"id" binding:"required"`
} //@name DeleteExpenseInput

type GetExpenseByIdInput struct {
	Id uint `uri:"id" binding:"required"`
} //@name GetExpenseByIdInput

type UpdateExpenseInput struct {
	Id           uint                    `uri:"id" binding:"required"`
	Month        *string                 `form:"month"`
	Year         *string                 `form:"year"`
	ProductionId *uint                   `form:"production_id"`
	TotalAmount  *float64                `form:"total_deduction"`
	DeleteFiles  []int                   `form:"delete_files"`
	Files        []*multipart.FileHeader `form:"files" swaggerignore:"true"`
} //@name UpdateExpenseInput

type UpdatedExpenseOutput struct {
	Id uint `json:"id"`
} //@name UpdatedExpenseOutput

type PatchExpenseInput struct {
	Id           uint     `uri:"id" binding:"required"` // from path
	Month        *string  `json:"month,omitempty"`
	Year         *string  `json:"year,omitempty"`
	ProductionId *uint    `json:"production_id,omitempty"`
	TotalAmount  *float64 `json:"total_deduction,omitempty"`
} //@name PatchExpenseInput
