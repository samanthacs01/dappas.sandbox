package templates

var ModelTmpl = `package model

type {{.Name}}Input struct {
}

type {{.Name}}Output struct {
}

type {{.Name}}PageOutput struct {
	Page int
	Size int
	Total int
	{{.Name}} []{{.Name}}Output
}
`
