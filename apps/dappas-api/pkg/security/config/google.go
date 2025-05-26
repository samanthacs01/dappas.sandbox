package config

type IGoogleConfig interface {
	GetClientId() string
	GetClientSecret() string
	GetRedirectUrl() string
	GetUserInfoEndpoint() string
}
