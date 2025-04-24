package dtos

import (
	domain "selector.dev/pulse/internal/domain/booking"
	"selector.dev/pulse/internal/domain/receivables"
)

type GenerateBillsInput struct {
	Flights []int `json:"flights"`
} //@name GenerateBillsInput

func (g *GenerateBillsInput) Validate() error {
	if len(g.Flights) == 0 {
		return domain.ErrFlightsAreRequired
	}
	return nil
}

type Invoices ListResponse[receivables.InvoiceListItem] //@name Invoices

type AcceptGeneratedBillingInput struct {
	Invoices []int `json:"ids" form:"ids" body:"ids"`
}
