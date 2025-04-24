package booking

import "errors"

var (
	ErrOrderPDFsAreRequired         = errors.New("order PDFs are required")
	ErrInvalidFileType              = errors.New("invalid file type, only PDFs are allowed")
	ErrDraftNotFound                = errors.New("draft not found")
	ErrDraftCannotBeDeleted         = errors.New("draft cannot be deleted")
	ErrNetCostFieldIsRequired       = errors.New("net total io cost field is required")
	ErrPayerIdFieldIsRequired       = errors.New("payer id field is required")
	ErrProductionIdFieldIsRequired  = errors.New("payer id field is required")
	ErrFlightNetCostFieldIsRequired = errors.New("flight net cost field is required")
	ErrFlightsAreRequired           = errors.New("flights are required")
	ErrFlightsAlreadyInvoiced       = errors.New("flights are already invoiced")
)
