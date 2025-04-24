package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

const (
	DEFAULT_DATABASE_URL = "postgres://postgres:password@localhost:5432/pulsedb?sslmode=disable"
)

//go:generate mockery --name=Config --output=../tests/mocks --filename=config.go
type Config interface {
	GetConStr() string
	IsDevelopment() bool
	GetSecretKey() []byte
	GetTokenExpiration() int
}

//go:generate mockery --name=FileManagerConfig --output=../tests/mocks --filename=file_manager_config.go
type FileManagerConfig interface {
	GetBucketName() string
	GetProjectID() string
	GetBasePath() string
	GetRealPath(internalPath string) string
}

//go:generate mockery --name=EmailConfig --output=../tests/mocks --filename=email_config.go
type EmailConfig interface {
	GetSendGridAPIKey() string
	GetResendEmailApiKey() string
	GetFromEmail() string
	GetSupportEmail() string
	GetConfirmLink() string
	GetLogoUrl() string
}

//go:generate mockery --name=WorkerConfig --output=../tests/mocks --filename=worker_config.go
type WorkerConfig interface {
	GetProjectNumber() string
	GetProcessorLocation() string
	GetProcessorID() string
	GetProcessorVersion() string
	GetBasePath() string
	GetProcessorEnv() string
}

func NewConfig() Config {
	return &config{}
}

func NewEmailConfig() EmailConfig {
	return &config{}
}

func NewFileManagerConfig() FileManagerConfig {
	return &config{}
}

func NewWorkerConfig() WorkerConfig {
	return &config{}
}

type config struct {
}

// GetConStr returns the connection string for the database
func (c *config) GetConStr() string {
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

// IsDevelopment returns true if the application is running in development mode
func (c *config) IsDevelopment() bool {
	env := getEnv("APP_ENV", "development")
	fmt.Println("Environment: ", env)
	return env == "development" || env == "dev"
}

func (c *config) GetProcessorEnv() string {
	env := getEnv("PROCESSOR_ENV", "dev")
	fmt.Println("Environment: ", env)
	return env
}

func (c *config) GetSecretKey() []byte {
	key := getEnv("SECRET_KEY", "S3cr3tK3y")
	return []byte(key)
}

func (ec *config) GetSendGridAPIKey() string {
	return getEnv("SENDGRID_API_KEY", "")
}

func (ec *config) GetResendEmailApiKey() string {
	return getEnv("RESEND_API_KEY", "")
}

func (ec *config) GetFromEmail() string {
	return getEnv("FROM_EMAIL", "Pulse GSM <no-replay@selector.com>")
}

func (ec *config) GetSupportEmail() string {
	return getEnv("SUPPORT_EMAIL", "yoan@selector.com")
}

func (ec *config) GetBucketName() string {
	return getEnv("CLOUD_STORAGE_BUCKET_NAME", "docs")
}

func (ec *config) GetProjectID() string {
	return getEnv("CLOUD_PROJECT_ID", "pulse-312012")
}

func (ec *config) GetBasePath() string {
	baseUrl := getEnv("BASE_URL", "http://localhost:8080")

	baseUrl = strings.TrimSuffix(baseUrl, "/")

	return baseUrl + "/uploads"
}

func (ec *config) GetRealPath(internalPath string) string {
	ip := strings.TrimPrefix(internalPath, "/")
	return ec.GetBasePath() + "/" + ip
}

func (ec *config) GetConfirmLink() string {
	frontendBaseUrl := getEnv("FRONTEND_BASE_URL", "http://localhost:3000")
	frontendBaseUrl = strings.TrimSuffix(frontendBaseUrl, "/")
	return frontendBaseUrl + "/activate-account?token=%s&email=%s"
}

func (ec *config) GetLogoUrl() string {
	return getEnv("LOGO_URL", "")
}

func (wc *config) GetProcessorID() string {
	return getEnv("DOCUMENT_AI_PROCESSOR_ID", "2e90a2892c49e422")
}

func (wc *config) GetProcessorVersion() string {
	return getEnv("DOCUMENT_AI_PROCESSOR_VERSIONS", "")
}

func (wc *config) GetProcessorLocation() string {
	return getEnv("DOCUMENT_AI_PROCESSOR_LOCATION", "us")
}

func (wc *config) GetProjectNumber() string {
	return getEnv("CLOUD_PROJECT_NUMBER", "40906428529")
}

func (wc *config) GetTokenExpiration() int {
	expire := getEnv("SESSION_EXPIRE", "2592000")
	expireInt, err := strconv.Atoi(expire)
	if err != nil {
		expireInt = 2592000
	}
	return expireInt
}

// getEnv gets the environment variable or returns a default value
func getEnv(key, defaultValue string) string {
	value, exists := os.LookupEnv(key)
	if !exists || len(value) == 0 {
		return defaultValue
	}
	return value
}
