package receivables

import "time"

type Payer struct {
	Id                 uint       `db:"auto"`
	EntityName         string     `db:"name=entity_name"`
	EntityAddress      *string    `db:"name=entity_address"`
	ContactName        string     `db:"name=contact_name"`
	ContactPhoneNumber *string    `db:"name=contact_phone_number"`
	ContactEmail       string     `db:"name=contact_email"`
	Identifier         string     `db:"name=identifier auto"`
	LastIONumber       int        `db:"name=io_last_generated"`
	PaymentTerms       int        `db:"name=payment_terms"`
	CreatedAt          time.Time  `db:"name=created_at auto"`
	UpdatedAt          time.Time  `db:"name=updated_at auto"`
	DeletedAt          *time.Time `db:"name=deleted_at auto"`
	ChangeBy           *string    `db:"name=change_by"`
}

type ViewPayer struct {
	ID                 uint   `db:"auto"`
	EntityName         string `db:"name=entity_name"`
	EntityAddress      string `db:"name=entity_address"`
	ContactName        string `db:"name=contact_name"`
	ContactPhoneNumber string `db:"name=contact_phone_number"`
	ContactEmail       string `db:"name=contact_email"`
}

func (d Payer) Track() bool {
	return true
}

type DraftInvoice struct {
	Id           int     `db:"name=invoice_id" json:"id"`
	Payer        string  `db:"name=payer" json:"payer"`
	AmountToPay  float64 `db:"name=amount" json:"amount_to_pay"`
	PaymentTerms int     `db:"name=payment_terms" json:"payment_terms"`
	DueDate      string  `db:"name=due_date" json:"due_date"`
}

type InvoiceListItem struct {
	Id           int           `json:"id"`
	Identifier   string        `json:"identifier"`
	Payer        string        `json:"payer"`
	Productions  []string      `json:"productions"`
	Bills        []*string     `json:"bills"`
	Advertisers  []string      `json:"advertisers"`
	AmountToPay  float64       `json:"amount_to_pay"`
	Balance      float64       `json:"balance"`
	PaymentTerms int           `json:"payment_terms"`
	InvoicedDate string        `json:"invoice_date"`
	DueDate      string        `json:"due_date"`
	Status       InvoiceStatus `json:"status"`
}

type ReceivableStats struct {
	TotalOutstanding           *float64 `json:"total_outstanding"`
	TotalOverdue               *float64 `json:"total_overdue"`
	CollectionRate             *float64 `json:"collection_rate"`
	CollectionWithPaymentTerms *float64 `json:"collection_with_payment_terms"`
	CustomerConcentration      *float64 `json:"customer_concentration"`
} //@name ReceivableStats

type ReceivableKpiDetailsItem struct {
	Grouping        string  `json:"label" db:"name=grouping"`
	GroupingDetails string  `json:"grouping_details" db:"name=grouping_details"`
	Value           float64 `json:"value" db:"name=total"`
} //@name ReceivableKpiValueItem

type InvoiceListFilter struct {
	Productions []int
	Payers      []int
	Sort        []struct{ Field, Direction string }
	Status      []string
	From        *string
	To          *string
	Offset      int
	Limit       int
	Search      *string
}

func (il *InvoiceListFilter) DateFilter() (string, string) {
	from := ""
	to := ""

	if il.From != nil {
		from = *il.From
	}
	if il.To != nil {
		to = *il.To
	}
	return from, to
}

func (il *InvoiceListFilter) GetSorts() []struct{ Field, Direction string } {
	addIdentifier := false
	for _, s := range il.Sort {
		if s.Field == "identifier" {
			addIdentifier = true
			break
		}
	}
	if addIdentifier {
		return il.Sort
	}
	return append(il.Sort, struct{ Field, Direction string }{"identifier", "desc"})
}

func (il *InvoiceListFilter) OffsetLimit() (int, int) {
	limit := il.Limit
	offset := il.Offset
	if offset < 0 {
		offset = 0
	}
	return offset, limit
}
