package builders

import (
	"fmt"
	"strings"
)

type SelectQueryBuilder struct {
	*baseQueryBuilder
	fields      []string
	joins       []string
	groupBy     []string
	orderBy     []string
	distinct    string
	limit       int
	offset      int
}

type SelectCountQueryBuilder struct {
	*baseQueryBuilder
	distinct string
	joins       []string
	groupBy     []string
}

type SelectRawQueryBuilder struct {
	*baseQueryBuilder
	query string
	orderBy     []string
	limit       int
	offset      int
}

func NewSelectQueryBuilder(tableName string) *SelectQueryBuilder {
	return &SelectQueryBuilder{
		baseQueryBuilder: &baseQueryBuilder{
			tableName: tableName,
		},
	}
}

func NewSelectRawQueryBuilder(query string, args []interface{}) *SelectRawQueryBuilder {
	return &SelectRawQueryBuilder{
		baseQueryBuilder: &baseQueryBuilder{args: args}	,
		query: query,
	}
}

func (qb *SelectQueryBuilder) AddField(field string) *SelectQueryBuilder {
	qb.fields = append(qb.fields, qb.addTable(field))
	return qb
}

func (qb *SelectQueryBuilder) AddFields(field ...string) *SelectQueryBuilder {
	for _, f := range field {
		qb.fields = append(qb.fields, qb.addTable(f))
	}
	return qb
}

func (qb *SelectQueryBuilder) InnerJoin(table string, on string) *SelectQueryBuilder {
	qb.joins = append(qb.joins, fmt.Sprintf("INNER JOIN %s ON %s", table, on))
	return qb
}

func (qb *SelectQueryBuilder) LeftJoin(table string, on string) *SelectQueryBuilder {
	qb.joins = append(qb.joins, fmt.Sprintf("LEFT JOIN %s ON %s", table, on))
	return qb
}

func (qb *SelectQueryBuilder) GroupBy(field string) *SelectQueryBuilder {
	qb.groupBy = append(qb.groupBy, qb.addTable(field))
	return qb
}

func (qb *SelectQueryBuilder) OrderByAsc(field string) *SelectQueryBuilder {
	qb.orderBy = append(qb.orderBy, fmt.Sprintf("%s ASC", qb.addTable(field)))
	return qb
}

func (qb *SelectQueryBuilder) OrderByDesc(field string) *SelectQueryBuilder {
	qb.orderBy = append(qb.orderBy, fmt.Sprintf("%s DESC", qb.addTable(field)))
	return qb
}

func (qb *SelectRawQueryBuilder) OrderByAsc(field string) *SelectRawQueryBuilder {
	qb.orderBy = append(qb.orderBy, fmt.Sprintf("%s ASC", qb.addTable(field)))
	return qb
}

func (qb *SelectRawQueryBuilder) OrderByDesc(field string) *SelectRawQueryBuilder {
	qb.orderBy = append(qb.orderBy, fmt.Sprintf("%s DESC", qb.addTable(field)))
	return qb
}

func (qb *SelectQueryBuilder) OrderByFields(sorts []struct{ Field, Direction string }, replaces map[string]string) *SelectQueryBuilder {
	for _, sort := range sorts {
		field := sort.Field
		if replaces != nil {
			if val, ok := replaces[field]; ok {
				field = val
			}
		}
		if sort.Direction == "desc" {
			qb.OrderByDesc(field)
		} else {
			qb.OrderByAsc(field)
		}
	}
	return qb
}

func (qb *SelectRawQueryBuilder) OrderByFields(sorts []struct{ Field, Direction string }, replaces map[string]string) *SelectRawQueryBuilder {
	for _, sort := range sorts {
		field := sort.Field
		if replaces != nil {
			if val, ok := replaces[field]; ok {
				field = val
			}
		}
		if sort.Direction == "desc" {
			qb.OrderByDesc(field)
		} else {
			qb.OrderByAsc(field)
		}
	}
	return qb
}

func (qb *SelectQueryBuilder) Take(limit int) *SelectQueryBuilder {
	qb.limit = limit
	return qb
}

func (qb *SelectQueryBuilder) Skip(offset int) *SelectQueryBuilder {
	qb.offset = offset
	return qb
}
func (qb *SelectRawQueryBuilder) Take(limit int) *SelectRawQueryBuilder {
	qb.limit = limit
	return qb
}

func (qb *SelectRawQueryBuilder) Skip(offset int) *SelectRawQueryBuilder {
	qb.offset = offset
	return qb
}

func (qb *SelectQueryBuilder) Distinct() *SelectQueryBuilder {
	qb.distinct = "DISTINCT"
	return qb
}

func (qb *SelectQueryBuilder) Build() (string, []interface{}) {
	query := fmt.Sprintf("SELECT %s %s FROM %s", qb.distinct,  strings.Join(qb.fields, ", "), qb.tableName)
	if len(qb.joins) > 0 {
		query += " " + strings.Join(qb.joins, " ")
	}
	if len(qb.conditions) > 0 {
		query += " WHERE " + strings.Join(qb.conditions, " AND ")
	}
	if len(qb.groupBy) > 0 {
		query += " GROUP BY " + strings.Join(qb.groupBy, ", ")
	}
	if len(qb.orderBy) > 0 {
		query += " ORDER BY " + strings.Join(qb.orderBy, ", ")
	}
	if qb.limit > 0 {
		query += fmt.Sprintf(" LIMIT %d", qb.limit)
	}
	if qb.offset > 0 {
		query += fmt.Sprintf(" OFFSET %d", qb.offset)
	}
	return query, qb.args
}

func (qb *SelectQueryBuilder) IsAuditable() bool {
	return false
}

func (qb *SelectQueryBuilder) ToCount() *SelectCountQueryBuilder {
	return &SelectCountQueryBuilder{
		baseQueryBuilder: qb.baseQueryBuilder,
		distinct: 	   qb.distinct,
		joins: 		   qb.joins,
		groupBy: 	   qb.groupBy,
	}
}


func (qb *SelectCountQueryBuilder) Build() (string, []interface{}) {
	query := fmt.Sprintf("SELECT COUNT(%s %s) as count FROM %s", qb.distinct, qb.GetTableOrAlias()+ ".id", qb.tableName)
	if len(qb.joins) > 0 {
		query += " " + strings.Join(qb.joins, " ")
	}
	if len(qb.conditions) > 0 {
		query += " WHERE " + strings.Join(qb.conditions, " AND ")
	}
	if len(qb.groupBy) > 0 {
		query += " GROUP BY " + strings.Join(qb.groupBy, ", ")
	}
	
	return query, qb.args
}

func (qb *SelectCountQueryBuilder) IsAuditable() bool {
	return false
}

func (qb *SelectQueryBuilder) Auditable(userId *uint) (string, []interface{}) {
	auditableQuery, auditableArgs := qb.Build()
	return qb.baseQueryBuilder.Auditable(auditableQuery, auditableArgs, "SELECT", userId)
}

func (qb *SelectCountQueryBuilder) Auditable(userId *uint) (string, []interface{}) {
	auditableQuery, auditableArgs := qb.Build()
	return qb.baseQueryBuilder.Auditable(auditableQuery, auditableArgs, "SELECT", userId)
}


func (qb *SelectRawQueryBuilder) Build() (string, []interface{}) {
	query := qb.query
	operator := " WHERE "
	if strings.Contains(qb.query, "WHERE") {
		operator = " AND "
	}
	
	if len(qb.orderBy) > 0 {
		query += " ORDER BY " + strings.Join(qb.orderBy, ", ")
	}
	
	if len(qb.conditions) > 0 {
		query += operator + strings.Join(qb.conditions, " AND ")
	}
	if qb.limit > 0 {
		query += fmt.Sprintf(" LIMIT %d", qb.limit)
	}
	if qb.offset > 0 {
		query += fmt.Sprintf(" OFFSET %d", qb.offset)
	}
	return query, qb.args
}

func (qb *SelectRawQueryBuilder) IsAuditable() bool {
	return false
}

func (qb *SelectRawQueryBuilder) Auditable(userId *uint) (string, []interface{}) {
	auditableQuery, auditableArgs := qb.Build()
	return qb.baseQueryBuilder.Auditable(auditableQuery, auditableArgs, "SELECT", userId)
}

