package dtos

import (
	"mime/multipart"
	"net/http"

	domain "selector.dev/pulse/internal/domain/booking"
	"selector.dev/webapi"
)

type InsertionOrderFilterInput ListWithFilterInput

type InsertionOrders ListResponse[domain.InsertionOrderListItem] //@name InsertionOrders

type IoDrafts ListResponse[domain.IoDraftListItem] //@name IoDrafts

type IoDraftFilterInput struct {
	*PaginatingInput
	Status webapi.CSStringList `form:"status"`
	Sorts  webapi.OrderBy      `form:"sort"`
} //@name IoDraftFilterInput

type Flights ListResponse[domain.FlightListItem] //@name Flights

type FlightFilterInput struct {
	*PaginatingInput
	Status      webapi.CSStringList `form:"status"`
	Productions webapi.CSIntList    `form:"productions"`
	Payers      webapi.CSIntList    `form:"payers"`
	Advertisers webapi.CSStringList `form:"advertisers"`
	From        *string             `form:"from"`
	To          *string             `form:"to"`
	Sorts       webapi.OrderBy      `form:"sort"`
}

type DraftByIdInput GetByIdInput[int] //@name DraftByIdInput

func (d *DraftByIdInput) Validate() error {
	if d.Id <= 0 {
		return domain.ErrDraftNotFound
	}
	return nil
}

type UploadOrdersInput struct {
	Files []*multipart.FileHeader `form:"files" swaggerignore:"true"`
} //@name UploadOrdersInput

func (u *UploadOrdersInput) Validate() error {
	if len(u.Files) == 0 {
		return domain.ErrOrderPDFsAreRequired
	}
	for _, file := range u.Files {
		if err := checkIfPDF(file); err != nil {
			return err
		}
	}
	return nil
}

func checkIfPDF(file *multipart.FileHeader) error {
	f, err := file.Open()
	if err != nil {
		return err
	}
	defer f.Close()

	buffer := make([]byte, 512)
	if _, err := f.Read(buffer); err != nil {
		return err
	}

	contentType := http.DetectContentType(buffer)
	if contentType != "application/pdf" {
		return domain.ErrInvalidFileType
	}

	return nil
}

type DeleteDraftInput struct {
	ID int `uri:"id" binding:"required"`
} //@name DeleteDraftInput

type IoDraftsAmountPendingToReview struct {
	Amount int64 `json:"pending_to_review"`
}
