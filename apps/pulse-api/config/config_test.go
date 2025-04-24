package config

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestAppConfig(t *testing.T) {
	t.Run("GetConStr when the vars are defined", func(t *testing.T) {
		os.Setenv("DB_HOST", "localhost")
		os.Setenv("DB_USER", "postgres")
		os.Setenv("DB_PASS", "password")
		os.Setenv("DB_NAME", "pulsedb")

		config := NewConfig()
		expected := "user=postgres password=password dbname=pulsedb host=localhost sslmode=disable"
		if config.GetConStr() != expected {
			t.Errorf("expected %s, got %s", expected, config.GetConStr())
		}

		// Unset environment variables to test default
		os.Unsetenv("DB_HOST")
		os.Unsetenv("DB_USER")
		os.Unsetenv("DB_PASSWORD")
		os.Unsetenv("DB_NAME")

		expected = DEFAULT_DATABASE_URL
		if config.GetConStr() != expected {
			t.Errorf("expected %s, got %s", expected, config.GetConStr())
		}
	})

	t.Run("GetConStr when the vars are not defined", func(t *testing.T) {
		os.Setenv("DB_HOST", "")
		os.Setenv("DB_USER", "")
		os.Setenv("DB_PASSWORD", "")
		os.Setenv("DB_NAME", "")

		config := NewConfig()
		expected := DEFAULT_DATABASE_URL
		if config.GetConStr() != expected {
			t.Errorf("expected %s, got %s", expected, config.GetConStr())
		}

		// Unset environment variables to test default
		os.Unsetenv("DB_HOST")
		os.Unsetenv("DB_USER")
		os.Unsetenv("DB_PASSWORD")
		os.Unsetenv("DB_NAME")

		expected = DEFAULT_DATABASE_URL
		if config.GetConStr() != expected {
			t.Errorf("expected %s, got %s", expected, config.GetConStr())
		}
	})

	t.Run("IsDevelopment when the vars are defined", func(t *testing.T) {
		os.Setenv("APP_ENV", "development")

		config := NewConfig()
		if !config.IsDevelopment() {
			t.Errorf("expected true, got false")
		}

		os.Setenv("APP_ENV", "production")
		if config.IsDevelopment() {
			t.Errorf("expected false, got true")
		}
	})

	t.Run("GetSecretKey when the vars are defined", func(t *testing.T) {
		// arrange
		os.Setenv("SECRET_KEY", "SecretKey")
		config := NewConfig()

		// act
		result := config.GetSecretKey()

		// assert
		assert.Equal(t, "SecretKey", string(result))

		// cleanup
		os.Unsetenv("SECRET_KEY")
	})

	t.Run("GetSecretKey when the vars are not defined", func(t *testing.T) {
		// arrange
		config := NewConfig()

		// act
		result := config.GetSecretKey()

		// assert
		assert.Equal(t, "S3cr3tK3y", string(result))
	})

	t.Run("GetTokenExpiration when the vars are defined", func(t *testing.T) {
		// arrange
		os.Setenv("SESSION_EXPIRE", "100")
		config := NewConfig()

		// act
		result := config.GetTokenExpiration()

		// assert
		assert.Equal(t, 100, result)

		// cleanup
		os.Unsetenv("SESSION_EXPIRE")
	})

	t.Run("GetTokenExpiration when the vars are not defined", func(t *testing.T) {
		// arrange
		config := NewConfig()

		// act
		result := config.GetTokenExpiration()

		// assert
		assert.Equal(t, 2592000, result)
	})

	t.Run("GetTokenExpiration when the vars are not valid int value", func(t *testing.T) {
		// arrange
		config := NewConfig()
		os.Setenv("SESSION_EXPIRE", "U100")

		// act
		result := config.GetTokenExpiration()

		// assert
		assert.Equal(t, 2592000, result)

		// cleanup
		os.Unsetenv("SESSION_EXPIRE")
	})
}

func TestEmailConfig(t *testing.T) {
	t.Run("GetConfirmLink when the vars are defined", func(t *testing.T) {
		// arrange
		os.Setenv("FRONTEND_BASE_URL", "http://localhost:8555")
		config := NewEmailConfig()

		// act
		result := config.GetConfirmLink()

		// assert
		assert.Equal(t, "http://localhost:8555/activate-account?token=%s&email=%s", result)

		// cleanup
		os.Unsetenv("FRONTEND_BASE_URL")
	})

	t.Run("GetConfirmLink when the vars are not defined", func(t *testing.T) {
		// arrange
		config := NewEmailConfig()

		// act
		result := config.GetConfirmLink()

		// assert
		assert.Equal(t, "http://localhost:3000/activate-account?token=%s&email=%s", result)
	})

	t.Run("GetResendEmailApiKey when the vars are defined", func(t *testing.T) {
		// arrange
		os.Setenv("RESEND_API_KEY", "ResendApiKey")
		config := NewEmailConfig()

		// act
		result := config.GetResendEmailApiKey()

		// assert
		assert.Equal(t, "ResendApiKey", result)

		// cleanup
		os.Unsetenv("RESEND_API_KEY")
	})

	t.Run("GetResendEmailApiKey when the vars are defined", func(t *testing.T) {
		// arrange
		config := NewEmailConfig()

		// act
		result := config.GetResendEmailApiKey()

		// assert
		assert.Equal(t, "", result)
	})

	t.Run("GetFromEmail when the vars are defined", func(t *testing.T) {
		// arrange
		os.Setenv("FROM_EMAIL", "Pulse GSM <email@com.cu>")
		config := NewEmailConfig()

		// act
		result := config.GetFromEmail()

		// assert
		assert.Equal(t, "Pulse GSM <email@com.cu>", result)

		// cleanup
		os.Unsetenv("FROM_EMAIL")
	})
	t.Run("GetSupportEmail when the vars are defined", func(t *testing.T) {
		// arrange
		os.Setenv("SUPPORT_EMAIL", "yy@selector.dev")
		config := NewEmailConfig()
		// act
		result := config.GetSupportEmail()
		// assert
		assert.Equal(t, "yy@selector.dev", result)
		// cleanup
		os.Unsetenv("SUPPORT_EMAIL")
	})
}
