package documents

import "context"

type Item struct {
	Key string
	Value interface{}
}

type IProcessor interface {
	Parse(ctx context.Context, mimeType string, data []byte) ([]Item, error)
	Close()
}