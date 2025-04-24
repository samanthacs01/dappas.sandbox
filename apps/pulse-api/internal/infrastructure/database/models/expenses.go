package models

import "time"

type Expense struct {
	Id           uint       `db:"name=id auto"`
	Month        string     `db:"name=month"`
	Year         string     `db:"name=year"`
	ProductionId uint       `db:"name=production_id"`
	TotalAmount  float64    `db:"name=total_deduction"`
	CreatedAt    time.Time  `db:"name=created_at auto"`
	UpdatedAt    time.Time  `db:"name=updated_at auto"`
	DeletedAt    *time.Time `db:"name=deleted_at auto"`
}

type ExpenseDoc struct {
	Id        uint       `db:"name=id auto"`
	ExpenseId uint       `db:"name=expense_id"`
	DocName   string     `db:"name=file_name"`
	DocPath   string     `db:"name=file_path"`
	CreatedAt time.Time  `db:"name=created_at auto"`
	UpdatedAt time.Time  `db:"name=updated_at auto"`
	DeletedAt *time.Time `db:"name=deleted_at auto"`
}

type ViewExpense struct {
	Id             uint    `db:"name=id"`
	Month          string  `db:"name=month"`
	Year           string  `db:"name=year"`
	ProductionName string  `db:"name=production_name"`
	ProductionId   uint    `db:"name=production_id"`
	TotalAmount    float64 `db:"name=total_amount"`
}
