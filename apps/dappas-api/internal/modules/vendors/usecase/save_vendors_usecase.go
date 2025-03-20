package usecase

import (
	"errors"

	"selector.dev/dappas/internal/modules/vendors/entity"
	"selector.dev/dappas/internal/modules/vendors/model"
	"selector.dev/dappas/internal/modules/vendors/repository"
)

//go:generate mockgen --destination=../mocks/mock_save_usecase.go --package=mocks selector.dev/dappas/internal/modules/vendors/usecase ISaveUseCase
type ISaveUseCase interface {
	Run(input *model.SaveInput) (*model.SaveOutput, error)
}

type saveUseCase struct {
	repository repository.VendorsRepository
}

func NewSaveUseCase(repository repository.VendorsRepository) ISaveUseCase {
	return &saveUseCase{
		repository: repository,
	}
}

func (u *saveUseCase) Run(input *model.SaveInput) (*model.SaveOutput, error) {
	u.repository.Save(&entity.Vendor{
		CompanyName:  "test",
		ContactEmail: "es",
	})
	return nil, errors.New("not implemented")
}
