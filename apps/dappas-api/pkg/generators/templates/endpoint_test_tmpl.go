package templates

var EndpointTestTmpl = `
package endpoint

import (
	"testing"
	"errors"
	"github.com/stretchr/testify/assert"
	"{{.Package}}/internal/modules/{{.Module}}/model"
	"{{.Package}}/internal/modules/{{.Module}}/mocks"
)
		
func Test{{.Name}}(t *testing.T) {
	t.Run("{{.Name}} successfully", func(t *testing.T) {
		// Arrange
		input := &model.{{.Name}}Request{}
		mocked := mocks.NewI{{.Name}}UseCase(t)
		mocked.EXPECT().Run(input).Return(&model.{{.Name}}Response{}, nil)
		ep := New{{.Name}}Endpoint(mocked)
		// Act
		result := ep.Handler(input)
		// Assert
		assert.NotNil(t, result)
		assert.Equal(t, 200, result.Status)
	})
			
	t.Run("{{.Name}} fails", func(t *testing.T) {
		// Arrange
		input := &model.{{.Name}}Request{}
		mocked := mocks.NewI{{.Name}}UseCase(t)
		mocked.EXPECT().Run(input).Return(nil, errors.New("not implemented"))
		ep := New{{.Name}}Endpoint(mocked)
		// Act
		result := ep.Handler(input)
		// Assert
		assert.NotNil(t, result)
		assert.Equal(t, 500, result.Status)
	})
}

`
