package workers

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"selector.dev/documents"
	domain "selector.dev/pulse/internal/domain/booking"
	"selector.dev/pulse/internal/domain/shared"
)

func TestParseEntity(t *testing.T) {
	// Arrange
	fieldMapping := map[string]string{
		Flights:           "flights",
		Creator:           "creator",
		Signed_Date:       "signed_date",
		Total_Impressions: "total_impressions",
		Gross_Total_Cost:  "gross_total_cost",
		Net_Total_Cost:    "net_total_cost",
		Payer:             "payer",
		Advertiser:        "advertiser",
	}

	payers := &[]shared.Nomenclator{
		{Id: "1", Text: "Payer1"},
		{Id: "2", Text: "Payer2"},
	}

	tests := []struct {
		name            string
		item            documents.Item
		expectedDraft   domain.IoDraft
		expectedFlights [][]documents.Item
	}{
		{
			name: "Parse Advertiser",
			item: documents.Item{Key: "advertiser", Value: "Test Advertiser"},
			expectedDraft: domain.IoDraft{
				Advertiser: ptr("Test Advertiser"),
			},
		},
		{
			name: "Parse Creator",
			item: documents.Item{Key: "creator", Value: "Test Creator"},
			expectedDraft: domain.IoDraft{
				Creator: ptr("Test Creator"),
			},
		},
		{
			name: "Parse Signed Date",
			item: documents.Item{Key: "signed_date", Value: map[string]interface{}{"year": 2023, "month": 10, "day": 5}},
			expectedDraft: domain.IoDraft{
				SignedDate: ptr("10-5-2023"),
			},
		},
		{
			name: "Parse Signed Date",
			item: documents.Item{Key: "signed_date", Value: "2023-10-05"},
			expectedDraft: domain.IoDraft{
				SignedDate: ptr("2023-10-05"),
			},
		},
		{
			name: "Parse Total Impressions",
			item: documents.Item{Key: "total_impressions", Value: "1000"},
			expectedDraft: domain.IoDraft{
				Impressions: ptr(1000),
			},
		},
		{
			name: "Parse Gross Total Cost",
			item: documents.Item{Key: "gross_total_cost", Value: map[string]interface{}{"amount": 100.5, "currency": "USD"}},
			expectedDraft: domain.IoDraft{
				GrossCost:         ptr(100.5),
				GrossCostCurrency: ptr("USD"),
			},
		},
		{
			name: "Parse Payer",
			item: documents.Item{Key: "payer", Value: "Payer1"},
			expectedDraft: domain.IoDraft{
				PayerId: ptr(1),
				Payer:   ptr("Payer1"),
			},
		},
		{
			name: "Parse Flights",
			item: documents.Item{Key: "flights", Value: []documents.Item{{Key: "flight1", Value: "value1"}}},
			expectedFlights: [][]documents.Item{
				{{Key: "flight1", Value: "value1"}},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var draft = domain.IoDraft{}
			var rawFlights [][]documents.Item

			// Act
			processEntity(tt.item, &draft, fieldMapping, payers, &rawFlights)

			// Assert
			assert.Equal(t, tt.expectedDraft, draft)
			assert.Equal(t, tt.expectedFlights, rawFlights)
		})
	}
}

func ptr[T any](v T) *T {
	return &v
}
