package database

import (
	"errors"
	"reflect"

	"selector.dev/database"
)

func RunCount(uow database.UnitOfWork, qb database.IQueryBuilder) (*int64, error) {
	var mapping database.Mapping = func(it map[string]interface{}) interface{} {
		return it["count"]
	}
	q := uow.AcquireQuery(&mapping)
	qResult, err := q.Query(qb)
	if err != nil {
		return nil, err
	}
	result := *qResult
	if len(result) == 0 {
		return nil, errors.New("no results")
	}
	count, ok := result[0].(int64)
	if !ok {
		return nil, errors.New("type assertion to int64 failed")
	}
	return &count, nil
}

func RunQuery[T interface{}](uow database.UnitOfWork, qb database.IQueryBuilder) (*[]T, error) {
	q := uow.AcquireQuery(nil)
	result, err := q.Query(qb)
	if err != nil {
		return nil, err
	}
	var items []T
	for _, it := range *result {
		row := it.(map[string]interface{})
		var item T
		if err := mapToStruct(row, &item); err != nil {
			return nil, err
		}
		items = append(items, item)

	}
	return &items, nil
}

func mapToStruct[T any](m map[string]interface{}, s *T) error {
	val := reflect.ValueOf(s).Elem()
	for k, v := range m {
		field, found := getFieldByTag(k, val)
		if !found {
			continue
		}
		if !field.IsValid() {
			continue
		}
		if !field.CanSet() {
			continue
		}
		fieldVal := reflect.ValueOf(v)
		if field.Type() != fieldVal.Type() {
			continue
		}
		field.Set(fieldVal)
	}
	return nil
}

func getFieldByTag(tag string, val reflect.Value) (reflect.Value, bool) {
	for i := 0; i < val.NumField(); i++ {
		field := val.Type().Field(i)
		dbTag := field.Tag.Get("db")
		if dbTag == "" {
			dbTag = field.Name
		}
		if dbTag == tag {
			fieldVal := val.Field(i)
			if fieldVal.CanSet() {
				return fieldVal, true
			}
		}
	}
	return reflect.Value{}, false
}