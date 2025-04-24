package shared

type PageInfo struct {
	Page     int
	PageSize int
	Total    int64
}

type ListResult[T any] struct {
	Items    []T
	PageInfo PageInfo
}

func NewListResult[T any](items []T, total *int64, page *int, size *int) *ListResult[T] {
	var _page int
	var _size int

	_total := int64(0)
	if total != nil {
		_total = *total
	}

	if size != nil {
		_size = *size
	}

	if page != nil {
		_page = *page
	}
	return &ListResult[T]{
		Items: items,
		PageInfo: PageInfo{
			Page:     _page,
			PageSize: _size,
			Total:    _total,
		},
	}
}
