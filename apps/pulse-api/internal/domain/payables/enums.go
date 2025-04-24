package payables

type ProductionBillingType string

const (
	ProductionBillingTypeBilling    = "billing"
	ProductionBillingTypeCollection = "collection"
)

type ProductionExpenseRecoupmentType string

const (
	ProductionExpenseRecoupmentTypeBefore = "before split"
	ProductionExpenseRecoupmentTypeAfter  = "after split"
)

type BillStatus string

const (
	BillStatusPending     BillStatus = "pending"
	BillStatusPartialPaid BillStatus = "partial_paid"
	BillStatusPaid        BillStatus = "paid"
)
