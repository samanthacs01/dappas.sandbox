package overview

type OverviewKpiDetailsItem struct {
	Grouping        string  `json:"label" db:"name=grouping"`
	GroupingDetails string  `json:"grouping_details" db:"name=grouping_details"`
	Value           float64 `json:"value" db:"name=total"`
} //@name OverviewKpiDetailsItem
type OverviewKpiDetailsItemWithComposeValue struct {
	Grouping        string  `json:"label" db:"name=grouping"`
	GroupingDetails string  `json:"grouping_details" db:"name=grouping_details"`
	Value           float64 `json:"value" db:"name=total"`
	Compose         float64 `json:"composed_value" db:"name=compose"`
} //@name OverviewKpiDetailsItem

type OverviewStats struct {
	TotalRevenue *float64 `json:"total_revenue"`
	GrossMargin  *float64 `json:"gross_margin"`
	Dso          *float64 `json:"dso"`
	Dpo          *float64 `json:"dpo"`
} //@name OverviewStats
