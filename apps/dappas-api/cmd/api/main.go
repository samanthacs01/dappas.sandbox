package main

import (
	"fmt"

	"selector.dev/dappas/internal/app"
)

func main() {
	// This is the entry point for the application
	fmt.Println("Hello, World!")
	app := app.BuildApp()
	app.Run()
}