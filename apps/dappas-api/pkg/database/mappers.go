package database

import (
	"errors"

	"github.com/jackc/pgx/v5"
)

func mapRowsToMap(rows pgx.Rows) (*[]map[string]interface{}, error) {
	var results []map[string]interface{}
    for rows.Next() {
        values, err := rows.Values()
        if err != nil {
            return nil, errors.New("error mapping rows to structs")
        }

        columns := rows.FieldDescriptions()
        rowMap := make(map[string]interface{})

        for i, col := range columns {
            rowMap[string(col.Name)] = values[i]
        }

        results = append(results, rowMap)
    }
	return &results, nil
}
