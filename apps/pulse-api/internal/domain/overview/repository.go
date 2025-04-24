package overview

//go:generate mockery --name=IOverviewRepository --output=../../../tests/mocks --filename=overview_repository.go
type IOverviewRepository interface {
	GetOverviewStatsKpi(start, end string) (*OverviewStats, error)
	GetOverviewStatsKpiDetails(statType, start, end string) ([]OverviewKpiDetailsItem, error)
	GetOverviewStatsKpiDetailsWithCompose(statType string, start string, end string) ([]OverviewKpiDetailsItemWithComposeValue, error)
	GetOverviewStackStatsKpiDetails(statType, start, end string) ([]map[string]interface{}, error)
}
