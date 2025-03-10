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

func CreateFeature(moduleName string, featureName string) error {
	// Ensure module and submodule name is provided
	cmd := exec.Command("go", "list", "-m")
	out, err := cmd.Output()
	if err != nil {
		log.Fatalf("Failed to obtain module: %v\n", err)
	}

	pkg := strings.TrimSpace(string(out))
	module := moduleName
	submodule := featureName
	modulePath := fmt.Sprintf("internal/modules/%s", module)

	// Initialize submodule files
	files := map[string]string{
		path.Join(modulePath, "entity", fmt.Sprintf("%s_entity.go", submodule)):                       templates.EntityTmpl,
		path.Join(modulePath, "repository", fmt.Sprintf("%s_repository.go", submodule)):               templates.RepositoryTmpl,
		path.Join(modulePath, "repository/postgres", fmt.Sprintf("%s_repository_impl.go", submodule)): templates.PostgresTmpl,
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
			Module     string
			ModuleName string
			Name       string
		}{
			Package:    pkg,
			Module:     module,
			ModuleName: submodule,
			Name:       CamelCase(submodule),
		}

		if err = tmpl.Execute(f, data); err != nil {
			fmt.Printf("Failed to execute template %s: %v\n", file, err)
			return err
		}

		fmt.Printf("Created %s\n", file)
	}

	fmt.Printf("Submodule %s of module %s has been initialized\n", submodule, module)
	return nil
}
