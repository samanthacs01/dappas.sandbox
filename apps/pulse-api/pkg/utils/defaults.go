package utils

func ValueOrDefault[T interface{}](value *T, defaultValue T) T {
	if value == nil {
		return defaultValue
	}
	return *value
}