package database

import (
	"reflect"
	"regexp"
	"strings"
)

func pluralize(name string) string {
	if strings.HasSuffix(name, "y") {
		return strings.TrimSuffix(name, "y") + "ies"
	}
	if strings.HasSuffix(name, "s") || strings.HasSuffix(name, "sh") || strings.HasSuffix(name, "ch") || strings.HasSuffix(name, "x") || strings.HasSuffix(name, "z") {
		return name + "es"
	}
	if strings.HasSuffix(name, "f") {
		return strings.TrimSuffix(name, "f") + "ves"
	}
	if strings.HasSuffix(name, "fe") {
		return strings.TrimSuffix(name, "fe") + "ves"
	}
	return name + "s"
}

func sanitizeString(input string) string {
	replacer := strings.NewReplacer(
		"--", "",
		";", "",
	)
	return replacer.Replace(input)
}

func getColumnName(field reflect.StructField) string {
	tag := field.Tag.Get("db")
	if tag == "" {
		return field.Name
	}

	tags := strings.Split(tag, ";")
	return tags[0]
}

func toSnakeCase(str string) string {
	var matchFirstCap = regexp.MustCompile("(.)([A-Z][a-z]+)")
	var matchAllCap = regexp.MustCompile("([a-z0-9])([A-Z])")

	snake := matchFirstCap.ReplaceAllString(str, "${1}_${2}")
	snake = matchAllCap.ReplaceAllString(snake, "${1}_${2}")
	return strings.ToLower(snake)
}

func extractAll(t interface{}, auto bool) (string, []string, []interface{}, bool) {
	isAuditable := false
	tValue := reflect.ValueOf(t)
	if tValue.Kind() == reflect.Ptr {
		tValue = tValue.Elem()
	}
	tType := tValue.Type()
	if a, ok := t.(Auditable); ok && a.Track() {
		isAuditable = true
	}
	numFields := tType.NumField()

	var columns []string
	var values []interface{}
	for i := 0; i < numFields; i++ {
		field := tType.Field(i)
		if tag := field.Tag.Get("db"); !auto && strings.Contains(tag, "auto") {
			continue
		}
		value := tValue.Field(i).Interface()
		if str, ok := value.(string); ok {
			value = sanitizeString(str)
		}

		columns = append(columns, getColumnName(field))
		values = append(values, value)
	}
	snakeName := toSnakeCase(tType.Name())
	return pluralize(snakeName), columns, values, isAuditable
}
