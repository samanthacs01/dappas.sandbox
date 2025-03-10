package builders

import (
	"fmt"
	"strings"
)

type InsertQueryBuilder struct {
	*baseQueryBuilder
	fields []string
	isAuditable bool
}

func NewInsertQueryBuilder(tableName string, isAuditable bool) *InsertQueryBuilder {
	return &InsertQueryBuilder{
		baseQueryBuilder: &baseQueryBuilder{
			tableName: tableName,
		},
		isAuditable: isAuditable,
	}
}

func (qb *InsertQueryBuilder) Add(field string, value interface{}) *InsertQueryBuilder {
	qb.fields = append(qb.fields, field)
	qb.args = append(qb.args, value)
	return qb
}

func (qb *InsertQueryBuilder) Build() (string, []interface{}) {
	columns := strings.Join(qb.fields, ", ")
	values := make([]string, len(qb.fields))
	for i := range qb.fields {
		values[i] = fmt.Sprintf("$%d", i+1)
	}
	query := fmt.Sprintf("INSERT INTO %s (%s) VALUES (%s) RETURNING id", qb.tableName, columns, strings.Join(values, ", "))
	return query, qb.args
}

func (qb *InsertQueryBuilder) IsAuditable() bool {
	return qb.isAuditable
}

func (qb *InsertQueryBuilder) Auditable(userId *uint) (string, []interface{}) {
	auditableQuery, auditableArgs := qb.Build()
	return qb.baseQueryBuilder.Auditable(auditableQuery, auditableArgs, "INSERT", userId)
}
