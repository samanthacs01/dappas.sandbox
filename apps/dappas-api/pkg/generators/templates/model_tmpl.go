package templates

var ModelTmpl = `package models

type {{.Name}}Input struct {
} //@name {{.Name}}Input

type {{.Name}}Output struct {
} //@name {{.Name}}Output

type {{.Name}}PageOutput struct {
	Page int
	Size int
	Total int
	{{.Name}} []{{.Name}}Output
} //@name {{.Name}}PageOutput
`
