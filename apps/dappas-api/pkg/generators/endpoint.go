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

func CreateEndpoint(moduleName string, featureName string, endpointName string) error {
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
		path.Join(modulePath, "endpoints", fmt.Sprintf("%s_%s_endpoint.go", endpointName, submodule)):      templates.EndpointTmpl,
		path.Join(modulePath, "endpoints", fmt.Sprintf("%s_%s_endpoint_test.go", endpointName, submodule)): templates.EndpointTestTmpl,
		path.Join(modulePath, "usecases", fmt.Sprintf("%s_%s_usecase.go", endpointName, submodule)):        templates.UsecaseTmpl,
		path.Join(modulePath, "models", fmt.Sprintf("%s_%s_model.go", endpointName, submodule)):            templates.ModelTmpl,
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
			Package      string
			Module       string
			ModuleName   string
			Feature      string
			Name         string
			InternalName string
			Endpoint     string
		}{
			Package:      pkg,
			Module:       module,
			ModuleName:   submodule,
			Feature:      CamelCase(submodule),
			Name:         CamelCase(endpointName),
			InternalName: camelCase(endpointName),
			Endpoint:     endpointName,
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
