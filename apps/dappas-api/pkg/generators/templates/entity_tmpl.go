package templates

var EntityTmpl = `package entities
import (
	"gorm.io/gorm"
)

type {{.Name}} struct {
	*gorm.Model
}
`
