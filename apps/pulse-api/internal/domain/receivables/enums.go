package receivables

type InvoiceStatus string

const (
	InvoiceStatusDraft          InvoiceStatus = "draft"
	InvoiceStatusPendingPayment InvoiceStatus = "pending_payment"
	InvoiceStatusPaid           InvoiceStatus = "paid"
	InvoiceStatusPartialPaid    InvoiceStatus = "partial_paid"
)
