package database

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Conn struct {
	*pgxpool.Pool
}

func InitDBPool(ctx context.Context, connectionString string) (*Conn, error) {
	pool, err := pgxpool.New(ctx, connectionString)
	if err != nil {
		return nil, err
	}
	return &Conn{pool}, nil
}

func (c *Conn) Acquire(ctx context.Context) (*pgxpool.Conn, error) {
	return c.Pool.Acquire(ctx)
}

type DoWork func(context.Context, pgx.Tx) error


func (c *Conn) UnitOfWork(ctx context.Context, txFunc DoWork) error {
	conn, err := c.Acquire(ctx)
	if err != nil {
		return err
	}
	defer conn.Release()
	tx, err := conn.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	if err := txFunc(ctx, tx); err != nil {
		return err
	}

	return tx.Commit(ctx)	
}