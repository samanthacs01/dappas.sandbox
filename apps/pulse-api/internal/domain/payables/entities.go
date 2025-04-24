package payables

import "time"

type Production struct {
	Id                              uint                            `db:"name=id auto"`
	EntityName                      string                          `db:"name=entity_name"`
	Address                         string                          `db:"name=address"`
	ContactName                     string                          `db:"name=contact_name"`
	ContactPhoneNumber              string                          `db:"name=contact_phone_number"`
	ContactEmail                    string                          `db:"name=contact_email"`
	ProductionSplit                 float64                         `db:"name=production_split"`
	ProductionBillingType           ProductionBillingType           `db:"name=production_billing_type"`
	ProductionExpenseRecoupmentType ProductionExpenseRecoupmentType `db:"name=production_expense_discount_type"`
	ContractFilePath                string                          `db:"name=contract_file_path"`
	NetPaymentTerms                 int                             `db:"name=net_payment_terms"`
	CreatedAt                       time.Time                       `db:"name=created_at auto"`
	UpdatedAt                       time.Time                       `db:"name=updated_at auto"`
	DeletedAt                       *time.Time                      `db:"name=deleted_at auto"`
	ChangeBy                        *string                         `db:"name=change_by"`
}

type ProductionListItem struct {
	Id          uint                  `json:"id"`
	EntityName  string                `json:"entity_name"`
	Balance     float64               `json:"balance"`
	Dpo         float64               `json:"dpo"`
	PaymentType ProductionBillingType `json:"payment_type"`
}

func (d Production) Track() bool {
	return true
}

type ProductionUpdateData struct {
	EntityName                      string
	EntityAddress                   string
	ContactName                     string
	ContactPhoneNumber              string
	ProductionSplit                 float64
	ProductionBillingType           ProductionBillingType
	ProductionExpenseRecoupmentType ProductionExpenseRecoupmentType
	NetPaymentTerms                 int
	ContractFilePath                string // Optional, if updating contract
}

type BillListItem struct {
	Id          int        `db:"name=identifier" json:"id"`
	Identifier  string     `db:"name=identifier" json:"identifier"`
	Production  string     `db:"name=production" json:"production"`
	PaymentType string     `db:"name=payment_type" json:"payment_type"`
	Grouping    string     `db:"name=grouping" json:"flight_month"`
	Amount      float64    `db:"name=amount" json:"amount"`
	Balance     float64    `db:"name=balance" json:"balance"`
	DueDate     *string    `db:"name=due_date" json:"due_date"`
	Status      BillStatus `db:"name=status" json:"status"`
}

type BillsListCriteria struct {
	Productions []int
	Status      []string
	Sort        []struct{ Field, Direction string } `form:"sort"`
	Page        *int
	Size        *int
} // @name BillsListInput

func (bc *BillsListCriteria) GetSort() []struct{ Field, Direction string } {
	_sort := bc.Sort
	hasIdentifier := false
	for _, s := range _sort {
		if s.Field == "identifier" {
			hasIdentifier = true
			break
		}
	}

	if !hasIdentifier {
		_sort = append(_sort, struct{ Field, Direction string }{Field: "identifier", Direction: "asc"})
	}
	return _sort
}

func (bc *BillsListCriteria) Paginate() (int, int) {
	limit := 15
	if bc.Size != nil {
		limit = *bc.Size
	}
	offset := 0
	if bc.Page != nil {
		offset = (*bc.Page - 1) * limit
	}
	return offset, limit
}

type ProductionBillingBillsListCriteria struct {
	Id     int
	Months []int
	Status []string
	Sort   []struct{ Field, Direction string } `form:"sort"`
	Page   *int
	Size   *int
} // @name BillsListInput

func (bc *ProductionBillingBillsListCriteria) GetSort() []struct{ Field, Direction string } {
	_sort := bc.Sort
	hasIdentifier := false
	for _, s := range _sort {
		if s.Field == "b_identifier" {
			hasIdentifier = true
			break
		}
	}

	if !hasIdentifier {
		_sort = append(_sort, struct{ Field, Direction string }{Field: "b_identifier", Direction: "asc"})
	}
	return _sort
}

func (bc *ProductionBillingBillsListCriteria) Paginate() (int, int) {
	limit := 15
	if bc.Size != nil {
		limit = *bc.Size
	}
	offset := 0
	if bc.Page != nil {
		offset = (*bc.Page - 1) * limit
	}
	return offset, limit
}

type ProductionCollectionBillsListCriteria struct {
	Id     int
	Payers []int
	Status []string
	From   string
	To     string
	Sort   []struct{ Field, Direction string } `form:"sort"`
	Page   *int
	Size   *int
} // @name BillsListInput

func (bc *ProductionCollectionBillsListCriteria) GetSort() []struct{ Field, Direction string } {
	_sort := bc.Sort
	hasIdentifier := false
	for _, s := range _sort {
		if s.Field == "b_identifier" {
			hasIdentifier = true
			break
		}
	}

	if !hasIdentifier {
		_sort = append(_sort, struct{ Field, Direction string }{Field: "b_identifier", Direction: "asc"})
	}
	return _sort
}

func (bc *ProductionCollectionBillsListCriteria) Paginate() (int, int) {
	limit := 15
	if bc.Size != nil {
		limit = *bc.Size
	}
	offset := 0
	if bc.Page != nil {
		offset = (*bc.Page - 1) * limit
	}
	return offset, limit
}

type ProductionBillingBillListItem struct {
	Id         int        `db:"name=id" json:"id"`
	Month      string     `db:"name=bill_month" json:"month"`
	Revenue    float64    `db:"name=revenue" json:"revenue"`
	Expenses   *float64   `db:"name=expenses" json:"expenses"`
	NetDue     float64    `db:"name=net_due" json:"net_due"`
	Balance    float64    `db:"name=balance" json:"balance"`
	DueDate    *string    `db:"name=due_date" json:"due_date"`
	Status     BillStatus `db:"name=status" json:"status"`
	BillId     string     `db:"name=b_identifier" json:"billId"`
	Production string     `db:"name=production" json:"production"`
}

type ProductionCollectionBillListItem struct {
	Id         int        `db:"name=id" json:"id"`
	Flight     string     `db:"name=identifier" json:"flight"`
	Payer      string     `db:"name=payer" json:"payer"`
	Revenue    float64    `db:"name=revenue" json:"revenue"`
	DueDate    *string    `db:"name=due_date" json:"due_date"`
	Status     BillStatus `db:"name=status" json:"status"`
	Production string     `db:"name=production" json:"production"`
	BillId     string     `db:"name=b_identifier" json:"billId"`
	Balance    float64    `db:"name=balance" json:"balance"`
	Amount     float64    `db:"name=amount" json:"amount"`
}

type PayableStats struct {
	TotalOutstanding                       *float64 `json:"total_outstanding"`
	TotalOverdue                           *float64 `json:"total_overdue"`
	OnTimePaymentRate                      *float64 `json:"on_time_payment_rate"`
	ProductionPaymentOnUnCollectedInvoices *float64 `json:"production_payment_on_uncollected_invoices"`
} //@name PayableStats

type PayablesKpiDetailsItem struct {
	Grouping        string  `json:"label" db:"name=grouping"`
	GroupingDetails string  `json:"grouping_details" db:"name=grouping_details"`
	Value           float64 `json:"value" db:"name=total"`
} //@name PayablesKpiDetailsItem

type ProductionStats struct {
	Booked                float64 `json:"total_booked"`
	NetRevenue            float64 `json:"net_revenue"`
	NextPaymentAmount     float64 `json:"next_payment_amount"`
	NextPaymentDate       *string `json:"next_payment_date"`
	AverageMonthlyRevenue float64 `json:"average_monthly_revenue"`
	MonthlyVariance       float64 `json:"monthly_variance"`
} //@name ProductionStats
