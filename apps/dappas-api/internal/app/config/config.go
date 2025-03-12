package config

import (
	"fmt"
	"os"

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

func getEnv(key, defaultValue string) string {
	value, exists := os.LookupEnv(key)
	if !exists || len(value) == 0 {
		return defaultValue
	}
	return value
}
