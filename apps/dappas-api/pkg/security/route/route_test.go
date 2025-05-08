package router

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"go.uber.org/mock/gomock"
	"selector.dev/security/endpoints"
	"selector.dev/security/mocks"
	"selector.dev/security/models"
)

func TestRoute(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	gin.SetMode(gin.TestMode)
	app := gin.New()

	loginOutput := &models.LoginOutput{
		AccessToken:  "access_token",
		RefreshToken: "refresh_token",
		ExpiresIn:    3600,
		TokenType:    "Bearer",
	}

	loginInput := &models.AuthInput{
		RequestType: models.RequestTypeInternalUser,
		Body: map[string]any{
			"email":    "",
			"password": "",
		},
	}

	mock := mocks.NewMockILoginUseCase(ctrl)
	mock.EXPECT().Run(gomock.Any()).Return(loginOutput, nil)
	authInternalUser := endpoints.NewAuthUserEndpoint(mock)

	Route(app, authInternalUser)

	body, err := json.Marshal(loginInput)
	if err != nil {
		t.Fatalf("Failed to marshal loginInput: %v", err)
	}

	req, _ := http.NewRequest("POST", "/v1/security/auth", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")

	resp := httptest.NewRecorder()

	app.ServeHTTP(resp, req)
	assert.Equal(t, 200, resp.Code, "Expected status code does not match")
}
