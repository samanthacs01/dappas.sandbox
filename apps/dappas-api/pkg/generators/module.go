package generators

import (
	"fmt"
	"html/template"
	"log"
	"os"
	"os/exec"
	"path"
	"strings"

	"selector.dev/generators/templates"
)

func CreateModule(module string) error {
	cmd := exec.Command("go", "list", "-m")
	out, err := cmd.Output()
	if err != nil {
		log.Fatalf("Failed to obtain module: %v\n", err)
	}

	pkg := strings.TrimSpace(string(out))
	modulePath := fmt.Sprintf("internal/modules/%s", module)

	// Initialize module directory
	directories := []string{
		modulePath,
		path.Join(modulePath, "entities"),
		path.Join(modulePath, "models"),
		path.Join(modulePath, "repositories"),
		path.Join(modulePath, "repositories/postgres"),
		path.Join(modulePath, "usecases"),
		path.Join(modulePath, "endpoints"),
		path.Join(modulePath, "router"),
		path.Join(modulePath, "migrations"),
	}

	for _, directory := range directories {
		fmt.Printf("Creating directory %s\n", directory)
		err := os.MkdirAll(directory, os.ModePerm)
		if err != nil {
			fmt.Printf("Failed to create directory %s: %v\n", directory, err)
			return err
		}
	}

	// Initialize module files
	files := map[string]string{
		path.Join(modulePath, "router", "router.go"):        templates.RouterTmpl,
		path.Join(modulePath, fmt.Sprintf("%s.go", module)): templates.ProviderTmpl,
	}

	for file, content := range files {
		tmpl, err := template.New(file).Parse(content)
		if err != nil {
			fmt.Printf("Failed to parse template %s: %v\n", file, err)
			return err
		}

		f, err := os.Create(file)
		if err != nil {
			fmt.Printf("Failed to create file %s: %v\n", file, err)
			return err
		}
		defer f.Close()

		data := struct {
			Package    string
			ModuleName string
			Name       string
		}{
			Package:    pkg,
			ModuleName: module,
			Name:       CamelCase(module),
		}

		if err = tmpl.Execute(f, data); err != nil {
			fmt.Printf("Failed to execute template %s: %v\n", file, err)
			return err
		}

		fmt.Printf("Created %s\n", file)
	}

	fmt.Printf("Module %s has been initialized\n", module)
	return nil
}
