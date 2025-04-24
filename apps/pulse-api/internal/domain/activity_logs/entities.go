package activity_logs

import "time"

type ActivityLogCriteria struct {
	Actors      []string
	Entities    []string
	EntitiesIds []int
	Actions     []string
	From        *string
	To          *string
	Sort        []struct{ Field, Direction string } `form:"sort"`
	Page        *int
	Size        *int
} // @name ActivityLogCriteria

type ActivityLogItem struct {
	Id       int                    `json:"id"`
	ActionAt *time.Time             `json:"action_at"`
	Actor    *string                `json:"actor"`
	Entity   string                 `json:"entity"`
	EntityId interface{}            `json:"entity_id"`
	Action   *string                `json:"action"`
	Data     map[string]interface{} `json:"data"`
} // @name ActivityLogItem
