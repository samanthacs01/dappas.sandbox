package middleware

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"selector.dev/dappas/internal/app/config"
)

func HmacValidationMiddleware(config config.IAppConfig) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Extract the HMAC signature from the request header
		hmacSignature := c.GetHeader("X-Shopify-Hmac-Sha256")
		if hmacSignature == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing HMAC signature"})
			c.Abort()
			return
		}
		// Read the request body
		body, err := c.GetRawData()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read request body"})
			c.Abort()
			return
		}
		c.Request.Body = io.NopCloser(bytes.NewBuffer(body))
		// Validate the HMAC signature
		if !validateHmacSignature(hmacSignature, config.GetShopifySharedSecret(), body) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid HMAC signature"})
			c.Abort()
			return
		}

		c.Next()
	}
}
func validateHmacSignature(signature, sharedSecret string, body []byte) bool {
	hmacFromBody := computeHMAC(sharedSecret, body)
	return signature == hmacFromBody
}

// computeHMAC computes the HMAC for the given data using the secret key.
func computeHMAC(secret string, data []byte) string {
	h := hmac.New(sha256.New, []byte(secret))
	h.Write(data)
	return hex.EncodeToString(h.Sum(nil))
}
