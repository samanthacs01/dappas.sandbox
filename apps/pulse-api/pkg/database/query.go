package database

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
)

func Query[T interface{}](c *Conn, qb IQueryBuilder, result *[]T) error {
	conn, err := c.Acquire(context.Background())
	if err != nil {
		return err
	}
	defer conn.Release()
	query, args := qb.Build()
	rows, e := conn.Query(context.Background(), query, args...)
	if e != nil {
		return e
	}
	defer rows.Close()
	return mapRowsToStructs(rows, result)
}

func Exec(ctx context.Context, tx pgx.Tx, qb IQueryBuilder, userId *uint) (*int64, error) {
	query, args := qb.Build()
	result, e := tx.Exec(ctx, query, args...)
	if e != nil {
		return nil, e
	}
	rowsAffected := result.RowsAffected()
	if qb.IsAuditable() {
		fmt.Println("AUDITABLE TABLE: adding new entry")
		auditQuery, auditArgs := qb.Auditable(userId)
		_, e := tx.Exec(ctx, auditQuery, auditArgs...)
		if e != nil {
			return nil, e
		}
		
	}
	return &rowsAffected, nil
}

func ExecWithoutContext(c *Conn, qb IQueryBuilder)  error {
	query, args := qb.Build()
	conn, err := c.Acquire(context.Background())
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

func ExecInTx(ctx context.Context, tx pgx.Tx, qb IQueryBuilder)  error {
	query, args := qb.Build()
	_, e := tx.Exec(ctx, query, args...)
	return e
}

func Save[T interface{}](ctx context.Context, tx pgx.Tx, qb IQueryBuilder, result *[]T, userId *uint) error {	
	query, args := qb.Build()
	rows, e := tx.Query(ctx, query, args...)
	if e != nil {
		return e
	}
	//defer rows.Close()
	err := mapRowsToStructs(rows, result)
	rows.Close()
	if qb.IsAuditable() {
		fmt.Println("AUDITABLE TABLE: adding new entry")
		auditQuery, auditArgs := qb.Auditable(userId)
		_, e := tx.Exec(ctx, auditQuery, auditArgs...)
		if e != nil {
			fmt.Println("Error while adding audit entry", e, auditQuery, auditArgs)
			return e
		}
	}
	return err
}
