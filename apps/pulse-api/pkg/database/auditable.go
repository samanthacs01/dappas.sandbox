package database

type Auditable interface {
	Track() bool
}

type DbLogger struct {
	ID        uint `db:"name=id auto"`
	TableName string `db:"name=table_name"`
	Action     string `db:"name=action"`
	Query string `db:"name=query"`
	Args string `db:"name=args"`
	CreatedBy uint `db:"name=created_by"`
	CreatedAt string `db:"name=created_at auto"` 
	UpdatedAt string `db:"name=updated_at auto"`
}