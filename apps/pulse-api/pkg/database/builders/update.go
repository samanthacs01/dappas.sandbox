package builders

import (
	"fmt"
	"strings"
)

type UpdateQueryBuilder struct {
	*baseQueryBuilder
	fields 	   []string
	isAuditable bool
}

func NewUpdateQueryBuilder(tableName string, isAuditable bool) *UpdateQueryBuilder {
	qb := &UpdateQueryBuilder{
		baseQueryBuilder: &baseQueryBuilder{
			tableName: tableName,
		},
		isAuditable: isAuditable,
	}
	qb.SetExpression("updated_at", "now() at time zone 'utc'")
	return qb;
}

func (qb *UpdateQueryBuilder) Set(field string, value interface{}) *UpdateQueryBuilder {
	qb.fields = append(qb.fields, fmt.Sprintf("%s = $%d", field, qb.NextArgument()))
	qb.args = append(qb.args, value)
	return qb
}

func (qb *UpdateQueryBuilder) SetExpression(field string, expression string) *UpdateQueryBuilder {
	qb.fields = append(qb.fields, fmt.Sprintf("%s = %s", field, expression))
	return qb
}

func (qb *UpdateQueryBuilder) Build() (string, []interface{}) {
	query := fmt.Sprintf("UPDATE %s SET %s", qb.tableName, strings.Join(qb.fields, ", "))
	
	if len(qb.conditions) > 0 {
		query += " WHERE " + strings.Join(qb.conditions, " AND ")
	}
	
	return query, qb.args
}

func (qb *UpdateQueryBuilder) IsAuditable() bool {
	return qb.isAuditable
}

func (qb *UpdateQueryBuilder) Auditable(userId *uint) (string, []interface{}) {
	auditableQuery, auditableArgs := qb.Build()
	return qb.baseQueryBuilder.Auditable(auditableQuery, auditableArgs, "UPDATE", userId)
}