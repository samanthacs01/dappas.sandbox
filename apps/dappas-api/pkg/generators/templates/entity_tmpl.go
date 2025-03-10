package templates

var EntityTmpl = `package entity

type {{.Name}} struct {
	Id int64 ` + "`json:\"id\"`" + `
}
`
