package websocket

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"go.uber.org/zap"
	"selector.dev/pulse/internal/application/dtos"
	application "selector.dev/pulse/internal/application/services"
	"selector.dev/pulse/internal/domain/shared/services"
)

type WebSocketManager struct {
	clients    map[*websocket.Conn]bool
	broadcast  chan []byte
	register   chan *websocket.Conn
	unregister chan *websocket.Conn
	mu         sync.Mutex
	booking    application.IBookingService
	logger     *zap.Logger
}

var (
	manager *WebSocketManager
	once    sync.Once
)

func ProvideWebSocketManager(booking application.IBookingService, logger *zap.Logger) services.INotification {
	once.Do(func() {
		manager = &WebSocketManager{
			clients:    make(map[*websocket.Conn]bool),
			broadcast:  make(chan []byte),
			register:   make(chan *websocket.Conn),
			unregister: make(chan *websocket.Conn),
			booking:    booking,
			logger:     logger,
		}
	})
	return manager
}

func (manager *WebSocketManager) SendBookingStatus(message string, withError bool) {
	status, err := manager.booking.GetFileProcessingStatus()
	if err != nil {
		manager.logger.Error("Error getting file processing status", zap.Error(err))
		return
	}

	pending, err := manager.booking.GetIoDraftsAmountPendingToReview()
	if err != nil {
		manager.logger.Error("Error getting pending drafts", zap.Error(err))
		return
	}
	p := *pending
	msg := dtos.Message{
		Message:         message,
		Processed:       status.Processed,
		Total:           status.Total,
		PendingToReview: p.Amount,
		WithErrors:      withError,
	}
	manager.SendMessage(msg)
}

func (manager *WebSocketManager) Run() {
	fmt.Println("WS Starting")
	for {
		select {
		case conn := <-manager.register:
			manager.mu.Lock()
			manager.clients[conn] = true
			manager.mu.Unlock()
		case conn := <-manager.unregister:
			manager.mu.Lock()
			if _, ok := manager.clients[conn]; ok {
				delete(manager.clients, conn)
				conn.Close()
			}
			manager.mu.Unlock()
		case message := <-manager.broadcast:
			manager.mu.Lock()
			for conn := range manager.clients {
				err := conn.WriteMessage(websocket.TextMessage, message)
				if err != nil {
					log.Printf("error: %v", err)
					conn.Close()
					delete(manager.clients, conn)
				}
			}
			manager.mu.Unlock()
		}
	}
}

func (manager *WebSocketManager) HandleConnections(g *gin.Context) {
	upgrader := websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	conn, err := upgrader.Upgrade(g.Writer, g.Request, nil)
	if err != nil {
		log.Fatal(err)
		return
	}
	manager.register <- conn

	defer func() {
		manager.unregister <- conn
	}()

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Printf("error: %v", err)
			manager.unregister <- conn
			break
		}
		log.Printf("received: %s", message)
		// Handle incoming messages here
	}
}

func (manager *WebSocketManager) SendMessage(dto interface{}) {
	message, err := json.Marshal(dto)
	if err != nil {
		log.Printf("error: %v", err)
		return
	}
	manager.broadcast <- message
}
