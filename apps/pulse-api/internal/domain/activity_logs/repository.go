package activity_logs

//go:generate mockery --name=IActivityLogRepository --output=../../../tests/mocks --filename=activity_logs_repository.go
type IActivityLogRepository interface {
	FindAll(search *string, filter *ActivityLogCriteria) (*[]ActivityLogItem, *int64, error)
}
