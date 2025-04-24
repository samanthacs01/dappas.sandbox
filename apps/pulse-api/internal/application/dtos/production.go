package dtos

import (
	"mime/multipart"
	"strings"

	domain "selector.dev/pulse/internal/domain/payables"
	"selector.dev/webapi"
)

type CreateProductionInput struct {
	EntityName                      string                                 `form:"entity_name"`
	EntityAddress                   string                                 `form:"entity_address"`
	ContactName                     string                                 `form:"contact_name"`
	ContactPhoneNumber              string                                 `form:"contact_phone_number"`
	ContactEmail                    string                                 `form:"contact_email"`
	ProductionSplit                 float64                                `form:"production_split"`
	ProductionBillingType           domain.ProductionBillingType           `form:"production_billing_type"`
	ProductionExpenseRecoupmentType domain.ProductionExpenseRecoupmentType `form:"production_expense_recoupment_type"`
	NetPaymentTerms                 int                                    `form:"net_payment_terms"`
	Contract                        *multipart.FileHeader                  `form:"contract_file" swaggerignore:"true"`
} //@name CreateProductionInput

type ProductionsFilterInput struct {
	*ListInput
	Sorts webapi.OrderBy `form:"sort"`
} //@name ProductionsFilterInput

type Productions ListResponse[domain.ProductionListItem] //@name Productions

func (f ProductionsFilterInput) Paginate() (int, int) {
	if f.ListInput == nil {
		return 1, 15
	}
	base := *f.ListInput
	return base.Paginate()
}

func (f ProductionsFilterInput) GetSearch() *string {
	if f.ListInput == nil {
		return nil
	}
	base := *f.ListInput
	return base.Search
}

type UpdateProductionInput struct {
	Id                              uint                                   `uri:"id" binding:"required" swaggerignore:"true"`
	EntityName                      string                                 `form:"entity_name"`
	EntityAddress                   string                                 `form:"entity_address"`
	ContactName                     string                                 `form:"contact_name"`
	ContactPhoneNumber              string                                 `form:"contact_phone_number"`
	ProductionSplit                 float64                                `form:"production_split"`
	ProductionBillingType           domain.ProductionBillingType           `form:"production_billing_type"`
	ProductionExpenseRecoupmentType domain.ProductionExpenseRecoupmentType `form:"production_expense_recoupment_type"`
	NetPaymentTerms                 int                                    `form:"net_payment_terms"`
	Contract                        *multipart.FileHeader                  `form:"contract_file" swaggerignore:"true"`
} //@name UpdateProductionInput

type ContractFile struct {
	Name string `json:"name"`
	Path string `json:"path"`
} //@name ContractFile

type ProductionResponse struct {
	Id                              uint                                   `json:"id"`
	EntityName                      string                                 `json:"entity_name"`
	EntityAddress                   string                                 `json:"entity_address"`
	ContactEmail                    string                                 `json:"contact_email"`
	ContactName                     string                                 `json:"contact_name"`
	ContactPhoneNumber              string                                 `json:"contact_phone_number"`
	ProductionSplit                 float64                                `json:"production_split"`
	ProductionBillingType           domain.ProductionBillingType           `json:"production_billing_type"`
	ProductionExpenseRecoupmentType domain.ProductionExpenseRecoupmentType `json:"production_expense_recoupment_type"`
	NetPaymentTerms                 int                                    `json:"net_payment_terms"`
	Contract                        ContractFile                           `json:"contract_file"`
} //@name ProductionResponse

type GetProductionByIDInput struct {
	ID uint `uri:"id" binding:"required"`
} //@name GetProductionByIDInput

type DeleteProductionInput struct {
	ID uint `uri:"id" binding:"required"`
} // @name DeleteProductionInput

type DeletedOutput struct {
	ID uint `json:"id"`
} // @name DeletedOutput

type ProductionStatsInput struct {
	Id    *uint  `form:"id"`
	Token string `headers:"authorization"`
	From  string `form:"from"`
	To    string `form:"to"`
	Type  string `uri:"type"`
} //@name ProductionStatsInput

func (i *ProductionStatsInput) GetToken() string {
	return strings.TrimPrefix(i.Token, "Bearer ")
}
