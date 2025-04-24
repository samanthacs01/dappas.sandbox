package models

type CountResult struct {
	Count int64 `db:"name=count"`
}

type CreatedResult struct {
	ID uint `db:"name=id"`
}
