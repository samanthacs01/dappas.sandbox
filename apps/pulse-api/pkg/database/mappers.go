package database

import (
	"errors"
	"reflect"

	"github.com/jackc/pgx/v5"
)

func mapRowsToStructs[T interface{}](rows pgx.Rows, dest *[]T) error {
	destVal := reflect.ValueOf(dest)
	if destVal.Kind() != reflect.Ptr || destVal.Elem().Kind() != reflect.Slice {
		return errors.New(`dest should be a pointer to a slice (e.g. &[]T{})`)
	}
	sliceType := destVal.Elem().Type().Elem()

	for rows.Next() {
		elem := reflect.New(sliceType).Elem()
		numFields := elem.NumField()
		fields := make([]interface{}, numFields)
		for i := 0; i < numFields; i++ {
			fields[i] = elem.Field(i).Addr().Interface()
		}
		if err := rows.Scan(fields...); err != nil {
			return err
		}
		destVal.Elem().Set(reflect.Append(destVal.Elem(), elem))
	}

	return rows.Err()
}
