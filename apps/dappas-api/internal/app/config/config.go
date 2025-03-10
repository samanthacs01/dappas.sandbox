package config

import (
	security "selector.dev/security/config"
)

type IAppConfig interface {
	GetConnectionString() string
}

type config struct {
}

// GetConnectionString implements IAppConfig.
func (c *config) GetConnectionString() string {
	return "host=localhost port=5432 user=postgres dbname=postgres password=postgres sslmode=disable"
}

// GetSecretKey implements config.ISecurityConfig.
func (c *config) GetSecretKey() string {
	return "S3cr3tK3y"
}

// GetTokenDuration implements config.ISecurityConfig.
func (c *config) GetTokenDuration() int {
	return 60
}

func NewSecurityConfig() security.ISecurityConfig {
	return &config{}
}

func NewAppConfig() IAppConfig {
	return &config{}
}
