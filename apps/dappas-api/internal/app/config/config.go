package config

import (
	"fmt"
	"os"
	"strconv"

	security "selector.dev/security/config"
)

const (
	DEFAULT_DATABASE_URL = "postgres://postgres:password@localhost:5432/pulsedb?sslmode=disable"
)

type Environment string

const (
	Development Environment = "development"
	Staging     Environment = "staging"
	Production  Environment = "production"
)

type IAppConfig interface {
	GetConnectionString() string
	GetEnvironment() Environment
}

type config struct {
}

// GetClientId implements config.IGoogleConfig.
func (c *config) GetClientId() string {
	return getEnv("GOOGLE_CLIENT_ID", "")
}

// GetClientSecret implements config.IGoogleConfig.
func (c *config) GetClientSecret() string {
	return getEnv("GOOGLE_CLIENT_SECRET", "")
}

// GetRedirectUrl implements config.IGoogleConfig.
func (c *config) GetRedirectUrl() string {
	return getEnv("GOOGLE_REDIRECT_URL", "")
}

// GetUserInfoEndpoint implements config.IGoogleConfig.
func (c *config) GetUserInfoEndpoint() string {
	return getEnv("GOOGLE_USER_INFO_ENDPOINT", "")
}

// GetEnvironment implements IAppConfig.
func (c *config) GetEnvironment() Environment {
	env := getEnv("ENV", "development")
	switch env {
	case "staging":
		return Staging
	case "production":
		return Production
	default:
		return Development
	}
}

// GetConnectionString implements IAppConfig.
func (c *config) GetConnectionString() string {
	host := getEnv("DB_HOST", "")
	user := getEnv("DB_USER", "")
	password := getEnv("DB_PASS", "")
	database := getEnv("DB_NAME", "")
	port := getEnv("DB_PORT", "")

	if len(host) == 0 || len(user) == 0 || len(password) == 0 || len(database) == 0 {
		return DEFAULT_DATABASE_URL
	}

	con := fmt.Sprintf("user=%s password=%s dbname=%s host=%s sslmode=disable", user, password, database, host)

	if len(port) > 0 {
		con = fmt.Sprintf("%s port=%s", con, port)
	}

	return con
}

// GetSecretKey implements config.ISecurityConfig.
func (c *config) GetSecretKey() string {
	return getEnv("SECRET_KEY", "")
}

// GetTokenDuration implements config.ISecurityConfig.
func (c *config) GetTokenDuration() int {
	tokenDuration := getEnv("JWT_DURATION", "300")
	if len(tokenDuration) > 0 || tokenDuration == "0" {
		return 300
	}
	duration, err := strconv.Atoi(tokenDuration)
	if err != nil {
		return 300
	}
	return duration
}

func NewSecurityConfig() security.ISecurityConfig {
	return &config{}
}

func NewAppConfig() IAppConfig {
	return &config{}
}

func NewGoogleConfig() security.IGoogleConfig {
	return &config{}
}

func getEnv(key, defaultValue string) string {
	value, exists := os.LookupEnv(key)
	if !exists || len(value) == 0 {
		return defaultValue
	}
	return value
}
