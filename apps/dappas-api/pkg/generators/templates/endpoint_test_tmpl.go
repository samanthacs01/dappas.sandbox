package templates

var EndpointTestTmpl = `
package endpoint

import (
	"testing"
	"errors"
	"github.com/stretchr/testify/assert"
	"go.uber.org/mock/gomock"
	"{{.Package}}/internal/modules/{{.Module}}/model"
	"{{.Package}}/internal/modules/{{.Module}}/mocks"
)
		
func Test{{.Name}}(t *testing.T) {
	ctrl := gomock.NewController(t)	
	t.Run("{{.Name}} successfully", func(t *testing.T) {
		// Arrange
		input := &model.{{.Name}}Request{}
		mocked := mocks.NewMockI{{.Name}}UseCase(ctrl)
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
		mocked := mocks.NewMockI{{.Name}}UseCase(ctrl)
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
