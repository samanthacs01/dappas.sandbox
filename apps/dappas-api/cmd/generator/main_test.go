package main

import (
	"fmt"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestExecute(t *testing.T) {
	moduleName := "test"
	// Teardown: Remove the test directory after each test
	t.Cleanup(func() {
		os.RemoveAll(fmt.Sprintf("internal/modules/%s", moduleName))
	})
	t.Run("Root command executes without error", func(t *testing.T) {
		// act
		err := rootCmd.Execute()
		// assert
		assert.Nil(t, err)
	})

	t.Run("Module command executes without error", func(t *testing.T) {
		// Arrange
		moduleName = "test"
		os.Args = []string{"", "mod", fmt.Sprintf("--name=%s", moduleName)}
		// act
		err := moduleCmd.Execute()
		// assert
		assert.Nil(t, err)
	})
}
