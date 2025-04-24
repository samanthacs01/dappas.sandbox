package expenses

type Expense struct {
	Id             uint    `json:"id"`
	ProductionName string  `json:"production_name"`
	ProductionId   uint    `json:"production_id"`
	Month          string  `json:"month"`
	Year           string  `json:"year"`
	TotalAmount    float64 `json:"total_deduction"`
} //@name Expense

type ExpenseDoc struct {
	Id        uint   `json:"id"`
	ExpenseId uint   `json:"-"`
	DocName   string `json:"name"`
	DocPath   string `json:"path"`
}

func (d Expense) Track() bool {
	return true
}
