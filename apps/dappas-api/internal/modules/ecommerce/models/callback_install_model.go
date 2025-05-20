package models

type ShopifyAuthCallbackInput struct {
	Shop string `json:"shop" form:"shop" query:"shop"`
	Host string `json:"host" form:"host" query:"host"`
	Hmac string `json:"hmac" form:"hmac" query:"hmac"`
} //@name ShopifyAuthCallbackInput

type ShopifyAuthCallbackOutput struct {
} //@name ShopifyAuthCallbackOutput
