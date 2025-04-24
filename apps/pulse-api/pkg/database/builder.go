package database

import (
	"fmt"
	"time"

	"selector.dev/database/builders"
)


type IQueryBuilder interface {
	Build() (string, []interface{})
	IsAuditable() bool
	Auditable(userId *uint) (string, []interface{})
}

func Update(t interface{}) *builders.UpdateQueryBuilder {
	tableName, columns, values, isAuditable := extractAll(t, false)
	fmt.Println("Update", tableName, columns, values, isAuditable)
	qb := builders.NewUpdateQueryBuilder(tableName, isAuditable)
	return qb
}

func  InsertInto(t interface{}) *builders.InsertQueryBuilder {
	tableName, columns, values, isAuditable := extractAll(t, false)
	fmt.Println("InsertInto", tableName, columns, values, isAuditable)
	qb := builders.NewInsertQueryBuilder(tableName, isAuditable)
	for i, col := range columns {
		qb.Add(col, values[i])
	}
	return qb
}

func Select(t interface{}, fields ...string) *builders.SelectQueryBuilder {
	tableName, columns, _, _ := extractAll(t, true)
	qb := builders.NewSelectQueryBuilder(tableName)
	if len(fields) > 0 {
		columns = fields
	}
	
	for _, col := range columns {
		qb.AddField(col)
	}

	return qb
}


func SoftDeleteFrom(t interface{}) *builders.UpdateQueryBuilder {
	tableName, _, _, isAuditable := extractAll(t, true)
	qb := builders.NewUpdateQueryBuilder(tableName, isAuditable)
	qb.Set("deleted_at", time.Now())
	if (isAuditable) {
		qb.IsNull("deleted_at")
	}
	return qb
}

func SelectRaw(query string, args []interface{}) *builders.SelectRawQueryBuilder {
	qb := builders.NewSelectRawQueryBuilder(query, args)
	return qb
}