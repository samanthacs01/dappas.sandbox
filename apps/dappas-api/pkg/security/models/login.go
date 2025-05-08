package models

import (
	"fmt"

	"selector.dev/security/exceptions"
)

type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
} //@name LoginInput

type LoginOutput struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresIn    int    `json:"expires_in"`
	TokenType    string `json:"token_type"`
} //@name LoginOutput

type RequestType string

const (
	RequestTypeInternalUser RequestType = "internal_user"
	RequestTypeCustomer     RequestType = "customer"
	RequestTypeDappas       RequestType = "dappas"
	RequestTypeRefreshToken RequestType = "refresh_token"
)

type AuthInput struct {
	RequestType RequestType    `json:"credentials_type"`
	Body        map[string]any `json:"body"` // CredentialsAuthInput or SocialSignAuthInput
} //@name AuthInput

func (input *AuthInput) GetBody() (IBodyValidation, error) {
	switch input.RequestType {
	case RequestTypeInternalUser:
		return NewCredentialsAuthInput(input.Body), nil
	case RequestTypeCustomer:
		return NewTokenAuthInput(input.Body), nil
	case RequestTypeDappas:
		return NewTokenAuthInput(input.Body), nil
	case RequestTypeRefreshToken:
		return NewTokenAuthInput(input.Body), nil
	default:
		return nil, fmt.Errorf("invalid request type: %s", input.RequestType)
	}
}

type IBodyValidation interface {
	Validate() error
}

type CredentialsAuthInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func NewCredentialsAuthInput(body map[string]any) *CredentialsAuthInput {
	fmt.Println("NewCredentialsAuthInput", body)
	return &CredentialsAuthInput{
		Email:    body["email"].(string),
		Password: body["password"].(string),
	}
}

func (input *CredentialsAuthInput) Validate() error {
	if input.Email == "" || input.Password == "" {
		return exceptions.ErrInvalidCredentials
	}
	return nil
}

type TokenAuthInput struct {
	Token string `json:"token"`
}

func NewTokenAuthInput(body map[string]any) *TokenAuthInput {
	return &TokenAuthInput{
		Token: body["token"].(string),
	}
}
func (input *TokenAuthInput) Validate() error {
	if input.Token == "" {
		return exceptions.ErrInvalidCredentials
	}
	return nil
}
