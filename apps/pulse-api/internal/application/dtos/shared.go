package dtos

import (
	"errors"

	"selector.dev/webapi"
)

type PaginatingInput struct {
	Page     *int `form:"page"`
	PageSize *int `form:"page_size"`
}

type ListInput struct {
	*PaginatingInput
	Search *string `form:"q"`
}

type CreatedOutput struct {
	Id uint `json:"id"`
} //@name CreatedOutput

type DeleteInput[T interface{}] struct {
	Id T `uri:"id" binding:"required"`
} // @name DeleteInput

type ListResponse[T any] struct {
	Items      []T            `json:"items"`
	Pagination PaginationInfo `json:"pagination"`
} // @name ListResponse

type PaginationInfo struct {
	Page    int   `json:"page"`
	PerPage int   `json:"per_page"`
	Total   int64 `json:"total"`
} // @name Pagination

func (f *PaginatingInput) Paginate() (int, int) {
	var page, size int = 1, 15
	if f != nil {
		if f.Page != nil {
			page = *f.Page
		}

		if f.PageSize != nil {
			size = *f.PageSize
		}
	}
	return page, size
}

type GetByIdInput[T interface{}] struct {
	Id T `uri:"id" binding:"required"`
} // @name GetByIdInput

type ListWithFilterInput struct {
	*PaginatingInput
	Search      *string             `form:"q"`
	Productions webapi.CSIntList    `form:"productions"`
	Status      webapi.CSStringList `form:"status"`
	Payers      webapi.CSIntList    `form:"payers"`
	From        *string             `form:"from"`
	To          *string             `form:"to"`
	Sorts       webapi.OrderBy      `form:"sort"`
}

func (f *ListWithFilterInput) OffsetLimit() (int, int) {
	limit := 15
	offset := 0
	if f.PaginatingInput != nil {
		p, s := f.PaginatingInput.Paginate()
		if s < 0 {
			return 0, 0
		}
		limit = s
		if (p - 1) > 0 {
			offset = (p - 1) * s
		}
	}
	return offset, limit
}

type RangeDateInput struct {
	From string `form:"from" required:"true"`
	To   string `form:"to" required:"true"`
} // @name RangeDateInput

type Message struct {
	Message         string `json:"message"`
	WithErrors      bool   `json:"with_errors"`
	Processed       int    `json:"processed"`
	PendingToReview int64  `json:"pending_to_review"`
	Total           int    `json:"total"`
} // @name Message

type RegisterPaymentInput struct {
	Id     int     `uri:"id" binding:"required" json:"-"`
	Amount float64 `json:"amount"`
}

func (f *RegisterPaymentInput) Validate() error {
	if f.Amount <= 0 {
		return errors.New("amount must be greater than 0")
	}
	return nil
}
