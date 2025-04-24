package utils

func Map[T, U any](ts []T, f func(T) U) []U {
	us := make([]U, len(ts))
	for i := range ts {
		us[i] = f(ts[i])
	}
	return us
}

func Contains[T comparable](ts []T, it T) bool {
	for i := range ts {
		if ts[i] == it {
			return true
		}
	}
	return false
}
