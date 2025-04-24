package migrations

import (
	"database/sql"
	"fmt"
	"io/ioutil"

	"os"
)

func readStoreProcedureSqlFile(filename string) (string, error) {
	// Read the file
	filePath := fmt.Sprintf("./internal/infrastructure/database/store_procedures/%s", filename)
	file, err := os.Open(filePath)
	if err != nil {
		return "", err
	}
	defer file.Close()
	// Read the file content
	content, err := ioutil.ReadAll(file)
	if err != nil {
		return "", err
	}
	return string(content), nil
}

func runStoreProcedureDdl(tx *sql.Tx, filename string) error {
	sql, err := readStoreProcedureSqlFile(filename)
	if err != nil {
		fmt.Println("Error reading file: ", filename, err)
		return err
	}
	_, err = tx.Exec(sql)
	if err != nil {
		fmt.Println("Error executing query: ", filename, err)
	}
	return err
}
