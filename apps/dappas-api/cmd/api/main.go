package main

import (
	"fmt"

	"selector.dev/dappas/internal/app"
)

//	@title			Swagger Dappas API
//	@version		2.0
//	@description	MVP Dappas-API description.
//	@termsOfService	http://swagger.io/terms/

//	@contact.name	API Support
//	@contact.url	http://www.swagger.io/support
//	@contact.email	support@swagger.io

//	@license.name	Apache 2.0
//	@license.url	http://www.apache.org/licenses/LICENSE-2.0.html

//	@BasePath	/

// @securityDefinitions.apikey	BearerAuth
// @in							header
// @name						Authorization
// @description				Description for what is this security definition being used
func main() {
	// This is the entry point for the application
	fmt.Println("Hello, World!")
	app := app.BuildApp()
	app.Run()
}
