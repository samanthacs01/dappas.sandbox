package config

//go:generate mockgen -destination=../mocks/mock_security_config.go -package=mocks selector.dev/security/config ISecurityConfig
type ISecurityConfig interface {
	GetSecretKey() string
	GetTokenDuration() int
}
