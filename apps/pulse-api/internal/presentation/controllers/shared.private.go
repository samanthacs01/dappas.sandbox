package controllers

import (
	"fmt"
	"strings"

	"github.com/golang-jwt/jwt"
)

func getRoleAndEntityByToken(tokenString string, secret []byte) (string, *uint) {
	tokenString = strings.TrimPrefix(tokenString, "Bearer ")
	claims := &jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return secret, nil
	})
	if err != nil || !token.Valid {
		return "", nil
	}

	_entity := (*claims)["EntityId"]

	fmt.Println("ENTITY")
	var entityId *uint
	userRole := ((*claims)["role"]).(string)
	if _entity != nil {
		e := uint((_entity).(float64))
		entityId = &e
	}

	return userRole, entityId
}
