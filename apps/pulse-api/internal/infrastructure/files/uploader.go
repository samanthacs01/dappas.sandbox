package files

import (
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"

	"go.uber.org/zap"
	"selector.dev/pulse/config"
	"selector.dev/pulse/internal/domain/shared/services"
)

type fileLocalUploader struct {
	logger *zap.Logger
}

func NewFileUploader(logger *zap.Logger, c config.FileManagerConfig, cfg config.Config) services.IFilesUploader {
	logger.Info("Creating file uploader", zap.Bool("isDevelopment", cfg.IsDevelopment()))
	return &fileLocalUploader{
		logger: logger,
	}
}

func (fu *fileLocalUploader) UploadFiles(t services.FileType, files []*multipart.FileHeader) (*[]services.UploadedFile, error) {
	fu.logger.Info("Uploading files local storage")
	internalUri := "/app/bucket/upload/"
	uploadDir := string(filepath.Separator) + string(t)
	if err := os.MkdirAll(internalUri+uploadDir, os.ModePerm); err != nil {
		return nil, fmt.Errorf("os.MkdirAll: %v", err)
	}
	var paths []services.UploadedFile
	for _, f := range files {
		src, err := f.Open()
		if err != nil {
			fmt.Println("f.Open", err, f.Filename)
			return nil, err
		}
		defer src.Close()

		uploadPath := filepath.Join(uploadDir, f.Filename)
		dst, err := os.Create(internalUri + uploadPath)
		if err != nil {
			fmt.Println("f.Create", err)
			return nil, err
		}
		defer dst.Close()

		if _, err := io.Copy(dst, src); err != nil {
			fmt.Println("f.Copy", err)
			return nil, err
		}
		paths = append(paths, services.UploadedFile{
			FileName: f.Filename,
			FilePath: uploadPath,
		})
	}

	return &paths, nil
}
