package dtos

import (
	"selector.dev/pulse/internal/domain/activity_logs"
	"selector.dev/webapi"
)

type ActivityLogs ListResponse[activity_logs.ActivityLogItem]

type ActivityLogInput struct {
	*PaginatingInput
	Search      *string             `form:"q"`
	Actors      webapi.CSStringList `form:"actors"`
	Entities    webapi.CSStringList `form:"entities"`
	EntitiesIds webapi.CSIntList    `form:"entities_ids"`
	Actions     webapi.CSStringList `form:"actions"`
	From        *string             `form:"from"`
	To          *string             `form:"to"`
	Sort        webapi.OrderBy      `form:"sort"`
} // @name ActivityLogInput
