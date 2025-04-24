package workers

type WorkerMessage struct {
	Message string        `json:"message"`
	Draft   []interface{} `json:"draft"`
}
