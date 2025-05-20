package middleware

import (
	"net/http"

	spf "github.com/bold-commerce/go-shopify/v4"
	"github.com/gin-gonic/gin"
	"selector.dev/dappas/internal/app/config"
)

func HmacValidationMiddleware(config config.IShopifyConfig) gin.HandlerFunc {
	return func(c *gin.Context) {
		app := &spf.App{
			ApiSecret: config.GetSharedSecret(),
		}
		if (!app.VerifyWebhookRequest(c.Request)) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid HMAC signature"})
			c.Abort()
			return
		}
		c.Next()
	}
}
