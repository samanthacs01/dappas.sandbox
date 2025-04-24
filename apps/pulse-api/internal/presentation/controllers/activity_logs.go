package controllers

import (
	"selector.dev/pulse/internal/application/dtos"
	"selector.dev/pulse/internal/application/services"
	"selector.dev/webapi"
)

type IActivityLogController interface {
	FindAll(filter *dtos.ActivityLogInput) (*webapi.Result[dtos.ActivityLogs], *webapi.Failure)
}

type activityLogController struct {
	service services.IActivityLogService
}

func NewActivityLogController(service services.IActivityLogService) IActivityLogController {
	return &activityLogController{service: service}
}

// FindAll godoc
// @Summary Find all activity logs
// @Description Find all activity logs
// @Tags activity_logs
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param page query int false "Page"
// @Param page_size query int false "Page size"
// @Param q query string false "Search"
// @Param from query string false "From: yyyy-mm-dd"
// @Param to query string false "To: yyyy-mm-dd"
// @Param actors query []string false "Actors"
// @Param entities query []string false "Entities"
// @Param entitiesIds query []string false "EntitiesIds"
// @Param actions query []string false "Actions"
// @Param sort query []string false "Sort"
// @Success 200 {object} dtos.ActivityLogs
// @Failure 400 {object} ProblemDetails
// @Failure 401 {object} ProblemDetails
// @Failure 500 {object} ProblemDetails
// @Router /activity_logs [get]
func (a *activityLogController) FindAll(input *dtos.ActivityLogInput) (*webapi.Result[dtos.ActivityLogs], *webapi.Failure) {
	items, err := a.service.FindAll(input)
	if err != nil {
		failure := webapi.InternalServerError(err)
		return nil, &failure
	}

	result := webapi.Ok(*items)
	return &result, nil
}
