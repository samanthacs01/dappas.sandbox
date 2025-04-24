package repositories

import (
	"fmt"
	"strings"
	"time"

	"selector.dev/database"
	"selector.dev/database/builders"
	domain "selector.dev/pulse/internal/domain/booking"
	"selector.dev/pulse/internal/infrastructure/database/models"
	"selector.dev/utils"
)

func (r *bookingsRepository) changeBy() string {
	userId := r.session.GetUserId()

	if userId == nil {
		return "background worker"
	}

	return fmt.Sprintf("%d", *userId)
}

func getValueOrDefault(value *float32, defaultValue *float32) *float32 {
	if value == nil {
		return defaultValue
	}
	return value
}

func mapIoDraftToIo(draft domain.ReviewedDraftInput, number string, changeBy *string) domain.InsertionOrder {
	return domain.InsertionOrder{
		IoDraftId:   &draft.DraftId,
		Number:      number, // Generate number
		PayerId:     draft.PayerId,
		NetCost:     draft.NetCost,
		Impressions: &draft.Impressions,
		GrossCost:   &draft.GrossCost,
		SignedDate:  draft.SignedDate,
		Status:      domain.InsertionOrderStatusPending,
		ChangeBy:    changeBy,
	}
}

func mapIoDraftFlightToFlight(draft domain.ReviewedFlightInput, ioId int, changeBy *string) database.IQueryBuilder {
	dates := strings.Join(draft.DropDates, "','")
	query := fmt.Sprintf("select fn_create_flights($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, array['%s'])", dates)
	_args := []interface{}{draft.DraftId, ioId, draft.ProductionId, changeBy, draft.AdsType, draft.TotalCost, draft.Impressions, draft.Cpm, draft.PromoCode, draft.Placement, draft.Advertiser, draft.Length, draft.Media}
	return builders.NewSelectRawQueryBuilder(query, _args)
}

func mapViewFlightToFlightListItem(flights []models.ViewFlight) []domain.FlightListItem {
	return utils.Map(flights, func(m models.ViewFlight) domain.FlightListItem {
		return domain.FlightListItem{
			Id:             m.Id,
			Identifier:     m.Identifier,
			InsertionOrder: m.InsertionOrder,
			Production:     m.Production,
			Payer:          m.Payer,
			Status:         domain.FlightStatus(m.Status),
			Cost:           m.TotalCost,
			DropDates:      m.DropDates,
			Advertiser:     m.Advertiser,
			Media:          m.Media,
			Impressions:    m.Impressions,
		}
	})
}

func generateInsertionOrderNumber(payerNumber string, ioNumber int) string {
	year := time.Now().Year() % 100
	return fmt.Sprintf("%02d-%s-%03d", year, payerNumber, ioNumber)
}

var mapDraftSortField map[string]string = map[string]string{
	"status":    "UPPER(view_io_draft_lists.status)",
	"file_name": "UPPER(view_io_draft_lists.file_name)",
}

var mapInsertionOrderSortField map[string]string = map[string]string{
	"cost":            "net_total_io_cost",
	"status":          "\"upper_status\"",
	"payer":           "\"upper_payer\"",
	"insertion_order": "number",
	"impressions":     "total_io_impressions",
}

var mapFlightSortField map[string]string = map[string]string{
	"advertiser": "\"upper_advertiser\"",
	"production": "\"upper_production\"",
	"media":      "\"upper_media\"",
	"status":     "\"upper_status\"",
	"payer":      "\"upper_payer\"",
	"cost":       "total_cost",
}
