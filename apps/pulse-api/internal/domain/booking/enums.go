package booking

type InsertionOrderStatus string

const (
	InsertionOrderStatusPending         InsertionOrderStatus = "pending"
	InsertionOrderStatusPartialInvoiced InsertionOrderStatus = "partial_invoiced"
	InsertionOrderStatusInvoiced        InsertionOrderStatus = "invoiced"
)

type IoDraftStatus string

const (
	IoDraftStatusPendingToReview IoDraftStatus = "pending_to_review"
	IoDraftStatusExtractingInfo  IoDraftStatus = "extracting_information"
	IoDraftStatusReviewed        IoDraftStatus = "reviewed"
	IoDraftStatusUploaded        IoDraftStatus = "uploaded"
	IoDraftStatusFailed          IoDraftStatus = "failed"
)

type FlightStatus string

const (
	FlightStatusPending  FlightStatus = "pending"
	FlightStatusInvoiced FlightStatus = "invoiced"
)

type FlightDateType string

const (
	FlightDateTypeSpecific FlightDateType = "specific"
	FlightDateTypeRange    FlightDateType = "range"
)
