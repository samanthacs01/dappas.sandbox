package dtos

import (
	"selector.dev/pulse/internal/domain/payables"
	"selector.dev/webapi"
)

type Bills ListResponse[payables.BillListItem] //@name Bills
type BillsListInput struct {
	*PaginatingInput
	Productions webapi.CSIntList    `form:"productions"`
	Status      webapi.CSStringList `form:"status"`
	Sort        webapi.OrderBy      `form:"sort"`
} // @name BillsListInput

func (i BillsListInput) Paginate() (int, int) {
	if i.PaginatingInput != nil {
		return i.PaginatingInput.Paginate()
	}
	return 1, 15
}

type ProductionBillingBills ListResponse[payables.ProductionBillingBillListItem] //@name ProductionBillingBills

type ProductionBillingBillsInput struct {
	*PaginatingInput
	Token        string              `header:"Authorization" swaggerignore:"true"`
	Months       webapi.CSIntList    `form:"months"`
	Status       webapi.CSStringList `form:"status"`
	Sort         webapi.OrderBy      `form:"sort"`
	ProductionId *uint               `form:"p_id"`
}

func (i ProductionBillingBillsInput) Paginate() (int, int) {
	if i.PaginatingInput != nil {
		return i.PaginatingInput.Paginate()
	}
	return 1, 15
}

type ProductionCollectionBills ListResponse[payables.ProductionCollectionBillListItem] //@name ProductionCollectionBills

type ProductionCollectionBillsInput struct {
	*PaginatingInput
	Token        string              `header:"Authorization" swaggerignore:"true"`
	ProductionId *uint               `form:"p_id"`
	Payers       webapi.CSIntList    `form:"payers"`
	Status       webapi.CSStringList `form:"status"`
	Sort         webapi.OrderBy      `form:"sort"`
	From         string              `form:"from"`
	To           string              `form:"to"`
}

func (i ProductionCollectionBillsInput) Paginate() (int, int) {
	if i.PaginatingInput != nil {
		return i.PaginatingInput.Paginate()
	}
	return 1, 15
}
