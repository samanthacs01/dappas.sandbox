package repositories

import (
	"fmt"
	"regexp"
)

type contextKey string

const userIDKey contextKey = "userId"

func getFormatFromDate(date string) string {
	if _isYYYYMMDD(date) {
		return "YYYY-MM-DD"
	}
	return "MM/DD/YYYY"
}

func _isYYYYMMDD(date string) bool {
	r, err := regexp.Compile(`^\d{4}-\d{2}-\d{2}$`)
	if err != nil {
		fmt.Println("Error in pattern:", err)
		return false
	}
	if r.MatchString(date) {
		return true
	}
	return false
}
