package generators

import (
	"regexp"
	"strings"

	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

func camelCase(s string) string {

	// Remove all characters that are not alphanumeric or spaces or underscores
	s = regexp.MustCompile("[^a-zA-Z0-9_ ]+").ReplaceAllString(s, "")

	// Replace all underscores with spaces
	s = strings.ReplaceAll(s, "_", " ")

	// Title case s
	s = cases.Title(language.AmericanEnglish, cases.NoLower).String(s)

	// Remove all spaces
	s = strings.ReplaceAll(s, " ", "")

	// Lowercase the first letter
	if len(s) > 0 {
		s = strings.ToLower(s[:1]) + s[1:]
	}

	return s
}

func CamelCase(s string) string {

	// Remove all characters that are not alphanumeric or spaces or underscores
	s = regexp.MustCompile("[^a-zA-Z0-9_ ]+").ReplaceAllString(s, "")

	// Replace all underscores with spaces
	s = strings.ReplaceAll(s, "_", " ")

	// Title case s
	s = cases.Title(language.AmericanEnglish, cases.NoLower).String(s)

	// Remove all spaces
	s = strings.ReplaceAll(s, " ", "")

	return s
}
