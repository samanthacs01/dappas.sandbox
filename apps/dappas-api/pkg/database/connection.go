package database

import (
	"context"

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

type DoWork func(IQuery) error
type Mapping func(map[string]interface{}) interface{}


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
	query := NewQueryWithTx(ctx, tx, nil)
	if err := txFunc(query); err != nil {
		return err
	}

	return tx.Commit(ctx)	
}

type UnitOfWork interface {
	Transaction(txFunc DoWork) error
	AcquireQuery(entity *Mapping) IQuery
}

type unitOfWork struct {
	c *Conn
	ctx context.Context
}

func NewUnitOfWor(c *Conn, ctx context.Context) UnitOfWork {
	return &unitOfWork{c: c, ctx: ctx}
}

func (u *unitOfWork) Transaction(txFunc DoWork) error {
	return u.c.UnitOfWork(u.ctx, txFunc)
}

func (u *unitOfWork) AcquireQuery(entityMapper *Mapping) IQuery {
	return NewQuery(u.c, u.ctx, entityMapper)
}