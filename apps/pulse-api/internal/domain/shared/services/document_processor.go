package services

import "context"

type IDocumentProcessor interface {
	Run(ctx context.Context) (*int, error)
}
