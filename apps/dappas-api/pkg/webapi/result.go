package webapi

type Result struct {
	Status  int
	Data    interface{}
	Headers *map[string]string
}

type problemDetails struct {
	Type     string `json:"type"`
	Title    string `json:"title"`
	Status   int    `json:"status"`
	Detail   string `json:"detail"`
	Instance string `json:"instance"`
} //@name ProblemDetails

func (r Result) IsFailed() bool {
	return r.Status >= 400
}
