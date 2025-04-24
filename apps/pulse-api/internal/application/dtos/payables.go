package dtos

type DetailRangeDateInput struct {
	*RangeDateInput
	Type string `uri:"type"`
}
