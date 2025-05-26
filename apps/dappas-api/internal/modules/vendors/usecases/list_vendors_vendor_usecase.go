package usecases

import (
	"errors"

	"selector.dev/dappas/internal/modules/vendors/models"
	"selector.dev/dappas/internal/modules/vendors/repositories"
)

//go:generate mockgen -destination=../mocks/mock_list_vendors_usecase.go -package=mocks selector.dev/dappas/internal/modules/vendors/usecases IListVendorsUseCase
type IListVendorsUseCase interface {
	Run(input *models.ListVendorsInput) (*models.ListVendorsOutput, error)
}

type listVendorsUseCase struct {
	Repository repositories.VendorRepository
}

func NewListVendorsUseCase(repository repositories.VendorRepository) IListVendorsUseCase {
	return &listVendorsUseCase{
		Repository: repository,
	}
}

func (u *listVendorsUseCase) Run(input *models.ListVendorsInput) (*models.ListVendorsOutput, error) {
	return nil, errors.New("not implemented")
}
