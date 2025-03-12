package database

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
)

type IQuery interface {
	Query(qb IQueryBuilder) (*[]interface{}, error)
	Exec(qb IQueryBuilder, userId *uint) (*int64, error)
	Save(qb IQueryBuilder, userId *uint) (*[]interface{}, error)
	ExecWithoutContext(qb IQueryBuilder) error
	ExecInTx(qb IQueryBuilder) error
}

type query struct {
	c *Conn
	tx pgx.Tx
	ctx context.Context
	mapper *Mapping
}

func NewQuery(c *Conn, ctx context.Context, mapper *Mapping) IQuery {
	return &query{c: c, ctx: ctx, mapper: mapper}
}

func NewQueryWithTx(ctx context.Context, tx pgx.Tx, mapper *Mapping) IQuery {
	return &query{ctx: ctx, tx: tx, mapper: mapper}
}

func (q *query) Query(qb IQueryBuilder) (*[]interface{}, error) {
	conn, err := q.c.Acquire(context.Background())
	if err != nil {
		return nil, err
	}
	defer conn.Release()
	query, args := qb.Build()
	rows, e := conn.Query(context.Background(), query, args...)
	if e != nil {
		return nil, e
	}
	defer rows.Close()
	data, err := mapRowsToStructs(rows)
	if err != nil {
		return nil, err
	}
	result := q.toInterface(*data)
	return &result, nil
}

func (q *query) Exec(qb IQueryBuilder, userId *uint) (*int64, error) {
	query, args := qb.Build()
	result, e := q.tx.Exec(q.ctx, query, args...)
	if e != nil {
		return nil, e
	}
	rowsAffected := result.RowsAffected()
	if qb.IsAuditable() {
		fmt.Println("AUDITABLE TABLE: adding new entry")
		auditQuery, auditArgs := qb.Auditable(userId)
		_, e := q.tx.Exec(q.ctx, auditQuery, auditArgs...)
		if e != nil {
			return nil, e
		}
	}
	return &rowsAffected, nil
}

func (q *query) ExecWithoutContext(qb IQueryBuilder)  error {
	query, args := qb.Build()
	conn, err := q.c.Acquire(context.Background())
	if err != nil {
		return err
	}
	defer conn.Release()
	ct, e := conn.Exec(context.Background(), query, args...)
	if e == nil {
		fmt.Println("AA", ct.String())
	}
	return e
}

func (q *query) ExecInTx(qb IQueryBuilder)  error {
	query, args := qb.Build()
	_, e := q.tx.Exec(q.ctx, query, args...)
	return e
}

func (q *query) Save(qb IQueryBuilder, userId *uint) (*[]interface{}, error) {
	query, args := qb.Build()
	rows, e := q.tx.Query(q.ctx, query, args...)
	if e != nil {
		return nil, e
	}
	//defer rows.Close()
	data, err := mapRowsToStructs(rows)
	if err != nil {
		return nil, err
	}
	rows.Close()
	if qb.IsAuditable() {
		fmt.Println("AUDITABLE TABLE: adding new entry")
		auditQuery, auditArgs := qb.Auditable(userId)
		_, e := q.tx.Exec(q.ctx, auditQuery, auditArgs...)
		if e != nil {
			fmt.Println("Error while adding audit entry", e, auditQuery, auditArgs)
			return nil, e
		}
	}
	result := q.toInterface(*data)
	return &result, nil
}

func(q *query) toInterface(items []map[string]interface{}) []interface{} {
	result := make([]interface{}, len(items))
	for i, v := range items {
		if q.mapper != nil {
			result[i] = (*q.mapper)(v)
		} else {
			result[i] = v
		}
	}
	return result
}