package services

import "github.com/gin-gonic/gin"

type INotification interface {
	SendMessage(dto interface{})
	SendBookingStatus(message string, withError bool)
	HandleConnections(g *gin.Context)
	Run()
}
