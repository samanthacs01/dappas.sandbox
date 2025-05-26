package google

import (
	"context"
	"encoding/json"
	"errors"

	"go.uber.org/zap"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"selector.dev/security/config"
	"selector.dev/security/entities"
	"selector.dev/security/exceptions"
)

type UserRepositoryImpl struct {
	config config.IGoogleConfig
	logger *zap.Logger
}
type GoogleConfigGetter func(string) config.IGoogleConfig

func NewGoogleUserRepositoryImpl(config config.IGoogleConfig, log *zap.Logger) *UserRepositoryImpl {
	return &UserRepositoryImpl{
		config: config,
		logger: log,
	}
}

func (r *UserRepositoryImpl) GetUserInfo(account, token string) (*entities.GoogleUserInfo, error) {

	if r.config == nil {
		return nil, errors.ErrUnsupported
	}

	googleAuthConfig := &oauth2.Config{
		ClientID:     r.config.GetClientId(),
		ClientSecret: r.config.GetClientSecret(),
		RedirectURL:  r.config.GetRedirectUrl(),
		Endpoint:     google.Endpoint,
	}
	oauthToken := &oauth2.Token{
		AccessToken: token,
	}
	ctx := context.Background()
	tokenInfo, err := googleAuthConfig.TokenSource(ctx, oauthToken).Token()
	if err != nil || !tokenInfo.Valid() {
		return nil, exceptions.ErrInvalidToken
	}
	client := googleAuthConfig.Client(ctx, oauthToken)
	//"https://www.googleapis.com/oauth2/v3/userinfo"
	resp, err := client.Get(r.config.GetUserInfoEndpoint())
	if err != nil {
		r.logger.Error("failed to fetch user info", zap.Error(err))
		return nil, exceptions.ErrUserNotFound
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		r.logger.Error("unexpected status code from user info endpoint", zap.Int("status", resp.StatusCode))
		return nil, exceptions.ErrUserNotFound
	}

	var userInfo entities.GoogleUserInfo
	if err := json.NewDecoder(resp.Body).Decode(&userInfo); err != nil {
		r.logger.Error("failed to decode user info response", zap.Error(err))
		return nil, exceptions.ErrDecodingUserInfo
	}

	return &userInfo, nil
}
