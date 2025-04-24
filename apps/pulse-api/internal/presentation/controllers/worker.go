package controllers

import (
	"context"

	"go.uber.org/zap"
	"selector.dev/pulse/internal/domain/shared/services"
	"selector.dev/webapi"
)

type IWorkerController interface {
	ProcessDocuments() (*webapi.Result[interface{}], *webapi.Failure)
}

type workerController struct {
	logger  *zap.Logger
	service services.IDocumentProcessor
	notify  services.INotification
}

func NewWorkerController(logger *zap.Logger, service services.IDocumentProcessor, notify services.INotification) IWorkerController {
	return &workerController{
		logger:  logger,
		service: service,
		notify:  notify,
	}
}

// ProcessDocuments godoc
// @Summary Process documents
// @Description Process documents
// @Tags Worker
// @Accept json
// @Produce json
// @Success 204 "it is ok"
// @Failure 500 {string} string "Internal server error"
// @Router /worker/process_documents [post]
func (c *workerController) ProcessDocuments() (*webapi.Result[interface{}], *webapi.Failure) {
	c.logger.Info("Processing documents")
	affected, err := c.service.Run(context.Background())

	if err != nil {
		c.logger.Error("Error processing documents", zap.Error(err))
		fail := webapi.InternalServerError(err)
		return nil, &fail
	}
	if *affected > 0 {
		go c.notify.SendBookingStatus("File processed finish", err != nil)
	}
	ok := webapi.NoContent()

	return &ok, nil
}
