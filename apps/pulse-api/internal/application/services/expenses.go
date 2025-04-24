package services

import (
	"fmt"
	"mime/multipart"
	"strconv"
	"strings"
	"time"

	"go.uber.org/zap"
	dtos "selector.dev/pulse/internal/application/dtos"
	domain "selector.dev/pulse/internal/domain/expenses"
	servicesShared "selector.dev/pulse/internal/domain/shared/services"
	"selector.dev/utils"
)

//go:generate mockery --name=ExpensesService --output=../../../tests/mocks --filename=expenses_service.go
type ExpensesService interface {
	FindAllExpenses(input *dtos.ExpenseFilterInput) (*dtos.Expenses, error)
	FindAllExpensesOfCollectionProduction(input *dtos.ProductionCollectionExpenseFilterInput) (*dtos.Expenses, error)
	CreateExpense(input *dtos.CreateExpenseInput) (*dtos.CreatedOutput, error)
	DeleteExpense(id uint) error
	FindExpenseById(id uint) (*dtos.ExpenseDetails, error)
	UpdateExpense(input *dtos.UpdateExpenseInput) (*dtos.UpdatedExpenseOutput, error)
}

type expensesService struct {
	repository   domain.IExpensesRepository
	fileUploader servicesShared.IFilesUploader
	logger       *zap.Logger
}

func NewExpensesService(repository domain.IExpensesRepository, logger *zap.Logger, fu servicesShared.IFilesUploader) ExpensesService {
	return &expensesService{
		repository:   repository,
		logger:       logger,
		fileUploader: fu,
	}
}

func (s *expensesService) FindAllExpenses(input *dtos.ExpenseFilterInput) (*dtos.Expenses, error) {
	productions := input.Productions.Values()
	months := input.MonthYear.LiteralValues()
	page, size := input.Paginate()
	offset := (page - 1) * size
	_sortBy := input.Sort.Values()

	_sortBy = append(_sortBy, struct {
		Field     string
		Direction string
	}{Field: "id", Direction: "desc"})

	expenses, total, err := s.repository.FindAllExpenses(&productions, &months, "", "", &size, &offset, _sortBy)
	if err != nil {
		return nil, err
	}

	result := dtos.Expenses{
		Items: *expenses,
		Pagination: dtos.PaginationInfo{
			Total:   *total,
			PerPage: size,
			Page:    page,
		},
	}
	return &result, nil
}

func (s *expensesService) FindAllExpensesOfCollectionProduction(input *dtos.ProductionCollectionExpenseFilterInput) (*dtos.Expenses, error) {
	productions := []int{int(*input.ProductionId)}
	months := []string{}
	page, size := input.Paginate()
	offset := (page - 1) * size
	_sortBy := input.Sort.Values()

	_sortBy = append(_sortBy, struct {
		Field     string
		Direction string
	}{Field: "id", Direction: "desc"})

	expenses, total, err := s.repository.FindAllExpenses(&productions, &months, input.From, input.To, &size, &offset, _sortBy)
	if err != nil {
		return nil, err
	}
	result := dtos.Expenses{
		Items: *expenses,
		Pagination: dtos.PaginationInfo{
			Total:   *total,
			PerPage: size,
			Page:    page,
		},
	}
	return &result, nil
}

func (s *expensesService) CreateExpense(input *dtos.CreateExpenseInput) (*dtos.CreatedOutput, error) {
	paths, err := s.fileUploader.UploadFiles(servicesShared.Expenses, input.Files)
	if err != nil {
		return nil, err
	}
	s.logger.Info("Files uploaded", zap.Any("paths", paths))
	docs := utils.Map(*paths, func(p servicesShared.UploadedFile) domain.ExpenseDoc {
		return domain.ExpenseDoc{
			DocName: p.FileName,
			DocPath: p.FilePath,
		}
	})
	year := time.Now().Year()
	expense := domain.Expense{
		ProductionId: input.ProductionId,
		Month:        input.Month,
		Year:         strconv.Itoa(year),
		TotalAmount:  input.TotalDeduction,
	}
	created, err := s.repository.CreateExpense(&expense, docs)
	if err != nil {
		return nil, err
	}
	r := dtos.CreatedOutput{
		Id: created.Id,
	}
	return &r, nil
}

func (s *expensesService) DeleteExpense(id uint) error {
	return s.repository.DeleteExpense(id)
}

func (s *expensesService) FindExpenseById(id uint) (*dtos.ExpenseDetails, error) {
	expense, docs, err := s.repository.FindExpenseById(id)
	if err != nil {
		return nil, err
	}

	expenseDTO := dtos.ExpenseDetails{
		Expense: &domain.Expense{
			Id:             expense.Id,
			ProductionName: expense.ProductionName,
			TotalAmount:    expense.TotalAmount,
			ProductionId:   expense.ProductionId,
			Year:           expense.Year,
			Month:          expense.Month,
		},
		Files: *docs,
	}

	return &expenseDTO, nil
}

func (s *expensesService) UpdateExpense(input *dtos.UpdateExpenseInput) (*dtos.UpdatedExpenseOutput, error) {
	existing, _, err := s.repository.FindExpenseById(input.Id)
	if err != nil {
		return nil, err
	}
	if input.Month != nil {
		existing.Month = *input.Month
	}
	if input.Year != nil {
		existing.Year = *input.Year
	}
	if input.ProductionId != nil {
		existing.ProductionId = *input.ProductionId
	}
	if input.TotalAmount != nil {
		existing.TotalAmount = *input.TotalAmount
	}

	var newDocs []domain.ExpenseDoc
	if len(input.Files) > 0 {
		paths, err := s.fileUploader.UploadFiles(servicesShared.Expenses, input.Files)
		if err != nil {
			files := utils.Map(input.Files, func(f *multipart.FileHeader) string {
				return f.Filename
			})
			return nil, fmt.Errorf("fail when upload documents %s %v", strings.Join(files, ","), err)
		}

		newDocs = utils.Map(*paths, func(p servicesShared.UploadedFile) domain.ExpenseDoc {
			return domain.ExpenseDoc{
				DocName: p.FileName,
				DocPath: p.FilePath,
			}
		})
	}

	updatedExpense, err := s.repository.UpdateExpense(existing, newDocs, input.DeleteFiles)
	if err != nil {
		return nil, err
	}

	output := dtos.UpdatedExpenseOutput{
		Id: updatedExpense.Id,
	}

	return &output, nil
}
