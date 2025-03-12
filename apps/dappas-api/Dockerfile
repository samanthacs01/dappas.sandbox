# Stage 1: Build the Go applications
FROM golang:alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the source code
COPY . .

# Download dependencies
RUN go mod download

# Generate Swagger docs
RUN go install github.com/swaggo/swag/cmd/swag@v1.8.12
RUN swag init -g ./cmd/api/main.go ./..

# Build the Go applications with static linking
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o dappas-api ./cmd/api/main.go

# Stage 2: Create a smaller image for the runtime
FROM alpine:3.21

# Install necessary dependencies
RUN apk --no-cache add ca-certificates

# Set the working directory inside the container
WORKDIR /root/

# Copy the built applications from the builder stage
COPY --from=builder /app/dappas-api .
COPY --from=builder /app/docs ./docs
COPY --from=builder /app/pkg/security/migrations ./migrations

# Expose the port the app runs on
EXPOSE 8080

# Default entrypoint (can be overridden in docker-compose.yml)
CMD [ "./dappas-api"]