echo "Current working directory: $(pwd)"

go run ./cmd/generator/main.go "$@"
go generate ./...