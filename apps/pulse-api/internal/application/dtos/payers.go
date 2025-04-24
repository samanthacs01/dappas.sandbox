package dtos

import "selector.dev/webapi"

type CreatePayerInput struct {
	EntityName         string `json:"entity_name"`
	EntityAddress      string `json:"entity_address"`
	ContactName        string `json:"contact_name"`
	ContactPhoneNumber string `json:"contact_phone_number"`
	ContactEmail       string `json:"contact_email"`
	PaymentTerms       int    `json:"payment_terms"`
} //@name CreatePayerInput

type UpdatePayerInput struct {
	Id                 uint   `uri:"id" binding:"required" json:"-"`
	EntityName         string `json:"entity_name"`
	EntityAddress      string `json:"entity_address"`
	ContactName        string `json:"contact_name"`
	ContactPhoneNumber string `json:"contact_phone_number"`
	ContactEmail       string `json:"contact_email"`
	PaymentTerms       int    `json:"payment_terms"`
} //@name UpdatePayerInput

type Payer struct {
	Id                 uint    `json:"id"`
	EntityName         string  `json:"entity_name"`
	EntityAddress      *string `json:"entity_address"`
	ContactName        string  `json:"contact_name"`
	ContactPhoneNumber *string `json:"contact_phone_number"`
	ContactEmail       string  `json:"contact_email"`
	Identifier         string  `json:"identifier"`
	PaymentTerms       int     `json:"payment_terms"`
} //@name Payer

type Payers ListResponse[Payer] //@name Payers

type PayerFilterInput struct {
	Search *string        `form:"q"`
	Sorts  webapi.OrderBy `form:"sort"`
	*PaginatingInput
} //@name PayerFilterInput

type PayerDeleteInput DeleteInput[int] //@name PayerDeleteInput
type PayerByIdInput GetByIdInput[int]  //@name PayerGetByIdInput

func (f PayerFilterInput) GetSorts() []struct{ Field, Direction string } {
	_sorts := f.Sorts.Values()
	if _sorts == nil {
		_sorts = append(_sorts, struct{ Field, Direction string }{"id", "desc"})
	}
	return _sorts
}
