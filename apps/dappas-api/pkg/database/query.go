package database

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
	"selector.dev/database/builders"
)

type IQuery interface {
	Query(qb IQueryBuilder) (*[]interface{}, error)
	Exec(qb IQueryBuilder, userId *uint) (*int64, error)
	Save(qb IQueryBuilder) (int64, error)
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
	data, err := mapRowsToMap(rows)
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

func (q *query) Save(qb IQueryBuilder) (int64, error) {
	strategy := getSaveStrategy(q, qb)
	return strategy.Save(qb)
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

type isaveStrategy interface {
	Save(qb IQueryBuilder) (int64, error)
}

type returningStrategy struct {
	query *query
}

func (i *returningStrategy) Save(qb IQueryBuilder) (int64, error) {
	query, args := qb.Build()
	rows, e := i.query.tx.Query(i.query.ctx, query, args...)
	if e != nil {
		return 0, e
	}
	defer rows.Close()
	data, err := mapRowsToMap(rows)
	if err != nil {
		return 0, err
	}
	id := (*data)[0]["id"].(int64)
	return id, nil
}

type affectedStrategy struct {
	query *query
}

func (u *affectedStrategy) Save(qb IQueryBuilder) (int64, error) {
	query, args := qb.Build()
	result, e := u.query.tx.Exec(u.query.ctx, query, args...)
	if e != nil {
		return 0, e
	}
	affected:= result.RowsAffected()
	return affected, nil
}

func getSaveStrategy(q *query, qb IQueryBuilder) isaveStrategy {
	if _, ok:= qb.(*builders.InsertQueryBuilder); ok {
		return &returningStrategy{query: q}
	}
	return &affectedStrategy{query: q}
}