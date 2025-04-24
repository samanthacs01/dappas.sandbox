package workers

import "errors"

var (
	ErrNoDraftsToProcess = errors.New("no drafts to process")
)
