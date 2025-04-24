# Stage 1: Build the Go applications
FROM golang:1.23.2-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the source code
COPY . .

# Download dependencies
RUN go mod download

# Generate Swagger docs
RUN go install github.com/swaggo/swag/cmd/swag@v1.8.12
RUN swag init .

# Build the Go applications with static linking
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o pulse-api ./main.go

# Stage 2: Create a smaller image for the runtime
FROM alpine:latest

# Install necessary dependencies
RUN apk --no-cache add ca-certificates

# Set the working directory inside the container
WORKDIR /root/

# Copy the built applications from the builder stage
COPY --from=builder /app/pulse-api .
COPY --from=builder /app/docs ./docs

# Expose the port the app runs on
EXPOSE 8080

# Default entrypoint (can be overridden in docker-compose.yml)
CMD [ "./pulse-api"]