package model

type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
} //@name LoginInput

type LoginOutput struct {
	Token string `json:"token"`
} //@name LoginOutput
