package controllers

import (
	"selector.dev/pulse/internal/application/dtos"
	"selector.dev/pulse/internal/domain/booking"
	"selector.dev/webapi"
)

type IAdvertisersController interface {
	GetItemsAsNomenclator() (*webapi.Result[dtos.Nomenclators], *webapi.Failure)
}

type advertisersController struct {
	repository booking.IAdvertisersRepository
}

func NewAdvertisersController(r booking.IAdvertisersRepository) IAdvertisersController {
	return &advertisersController{
		repository: r,
	}
}

// GetItemsAsNomenclator godoc
// @Summary Get advertisers as nomenclator
// @Description Get advertisers as nomenclator
// @Tags filters
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Success 200 {object} dtos.Nomenclators
// @failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /filters/advertisers [get]
func (c *advertisersController) GetItemsAsNomenclator() (*webapi.Result[dtos.Nomenclators], *webapi.Failure) {
	items, err := c.repository.GetItemsAsNomenclator()
	if err != nil {
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	_items := dtos.Nomenclators(*items)
	result := webapi.Ok(_items)
	return &result, nil
}
