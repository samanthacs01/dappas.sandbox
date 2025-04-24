package models

type ViewProduction struct {
	ID          uint    `db:"name=id"`
	EntityName  string  `db:"name=entity_name"`
	Balance     float64 `db:"name=balance"`
	Dpo         float64 `db:"name=dpo"`
	PaymentType string  `db:"name=payment_type"`
}
