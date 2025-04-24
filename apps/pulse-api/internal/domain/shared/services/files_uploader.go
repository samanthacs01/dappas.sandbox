package services

import "mime/multipart"

type FileType string

const (
	InsertionOrders FileType = "orders"
	Expenses        FileType = "expenses"
	Contracts       FileType = "contracts"
)

type UploadedFile struct {
	FileName string
	FilePath string
}

//go:generate mockery --name=IFilesUploader --output=../../../../tests/mocks --filename=file_uploader.go
type IFilesUploader interface {
	UploadFiles(t FileType, f []*multipart.FileHeader) (*[]UploadedFile, error)
}
