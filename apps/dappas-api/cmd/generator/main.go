package main

import (
	"fmt"
	"os"
	"os/exec"

	"github.com/spf13/cobra"
	"selector.dev/generators"
)

var moduleName string
var moduleCmd = &cobra.Command{
	Use:   "mod",
	Short: "Create a new module",
	Run: func(cmd *cobra.Command, args []string) {
		if len(moduleName) == 0 {
			cmd.Help()
			return
		}
		err := generators.CreateModule(moduleName)
		if err != nil {
			fmt.Println("Error creating module:", err)
			return
		}
		fmt.Println("Module create successfully.")
	},
}

var featureName string
var featureCmd = &cobra.Command{
	Use:   "feat",
	Short: "Create a new feature",
	Run: func(cmd *cobra.Command, args []string) {
		if len(moduleName) == 0 || len(featureName) == 0 {
			cmd.Help()
			return
		}
		err := generators.CreateFeature(moduleName, featureName)
		if err != nil {
			fmt.Println("Error creating feature:", err)
			return
		}
		fmt.Println("Feature create successfully.")
		executeShellCommand()
	},
}

var endpointName string
var endpointCmd = &cobra.Command{
	Use:   "endpoint",
	Short: "Create a new endpoint",
	Run: func(cmd *cobra.Command, args []string) {
		if len(moduleName) == 0 || len(featureName) == 0 || len(endpointName) == 0 {
			cmd.Help()
			return
		}
		err := generators.CreateEndpoint(moduleName, featureName, endpointName)
		if err != nil {
			fmt.Println("Error creating endpoint:", err)
			return
		}
		fmt.Println("Endpoint create successfully.")
		executeShellCommand()
	},
}

var rootCmd = &cobra.Command{
	Use:   "gen",
	Short: "",
	Long:  "",
	Run: func(cmd *cobra.Command, args []string) {
		if len(args) == 0 {
			cmd.Help()
		}
	},
}

func init() {
	moduleName := "Module name"
	featName := "Feature name"
	moduleCmd.Flags().StringVarP(&moduleName, "name", "n", "", moduleName)
	moduleCmd.MarkFlagRequired("name")
	rootCmd.AddCommand(moduleCmd)

	featureCmd.Flags().StringVarP(&moduleName, "module", "m", "", moduleName)
	featureCmd.Flags().StringVarP(&featureName, "name", "n", "", featName)
	featureCmd.MarkFlagRequired("module")
	featureCmd.MarkFlagRequired("name")
	rootCmd.AddCommand(featureCmd)

	endpointCmd.Flags().StringVarP(&moduleName, "module", "m", "", moduleName)
	endpointCmd.Flags().StringVarP(&featureName, "feature", "f", "", featName)
	endpointCmd.Flags().StringVarP(&endpointName, "name", "n", "", "Endpoint name")
	endpointCmd.MarkFlagRequired("module")
	endpointCmd.MarkFlagRequired("feature")
	endpointCmd.MarkFlagRequired("name")
	rootCmd.AddCommand(endpointCmd)
}

func executeShellCommand() {
	cmd := exec.Command("go", "generate", "./...")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	err := cmd.Run()
	if err != nil {
		fmt.Println("Error executing go generate:", err)
	}
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func main() {
	Execute()
}
