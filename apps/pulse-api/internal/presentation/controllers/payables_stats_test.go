package controllers

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"selector.dev/pulse/internal/application/dtos"
	"selector.dev/pulse/internal/domain/payables"
	"selector.dev/pulse/tests/mocks"
)

func TestPayableStatsController_(t *testing.T) {
	mocked := mocks.NewIBillsRepository(t)
	t.Run("GetKpiByDateRange_Successfully", func(t *testing.T) {
		// Arrange
		_totalOutstanding := 1000.0
		_totalOverdue := 1000.0
		_onTimePaymentRate := 56.0
		_productionUncollected := 57.0

		data := payables.PayableStats{
			TotalOutstanding:                       &_totalOutstanding,
			TotalOverdue:                           &_totalOverdue,
			OnTimePaymentRate:                      &_onTimePaymentRate,
			ProductionPaymentOnUnCollectedInvoices: &_productionUncollected,
		}
		input := &dtos.RangeDateInput{
			From: "2025-01-01",
			To:   "2025-01-31",
		}
		mocked.On("GetPayablesStatsKpi", input.From, input.To).Return(&data, nil)
		controller := NewPayableStatsController(mocked)

		// Act
		result, fail := controller.GetKpiByDateRange(input)

		// Assert
		assert.NotNil(t, result)
		assert.Nil(t, fail)
		assert.Equal(t, 200, result.Status)
		assert.Equal(t, &_totalOutstanding, result.Data.TotalOutstanding)
		assert.Equal(t, &_totalOverdue, result.Data.TotalOverdue)
		assert.Equal(t, &_onTimePaymentRate, result.Data.OnTimePaymentRate)
		assert.Equal(t, &_productionUncollected, result.Data.ProductionPaymentOnUnCollectedInvoices)
	})
	t.Run("GetKpiByDateRange_Failed", func(t *testing.T) {
		// Arrange
		err := errors.New("invalid date range")
		input := &dtos.RangeDateInput{
			From: "2025-02-01",
			To:   "2025-02-07",
		}
		mocked.On("GetPayablesStatsKpi", input.From, input.To).Return(nil, err)
		controller := NewPayableStatsController(mocked)

		// Act
		result, fail := controller.GetKpiByDateRange(input)

		// Assert
		assert.Nil(t, result)
		assert.NotNil(t, fail)
		assert.Equal(t, 500, fail.Status)
		assert.Equal(t, err.Error(), fail.Data.Detail)
	})
	t.Run("GetKpiDetailsByTypeAndDateRange_Successfully", func(t *testing.T) {
		// Arrange
		data := []payables.PayablesKpiDetailsItem{
			{
				Grouping:        "Test",
				GroupingDetails: "Test details",
				Value:           100.0,
			},
		}
		input := &dtos.DetailRangeDateInput{
			RangeDateInput: &dtos.RangeDateInput{
				From: "2025-01-01",
				To:   "2025-01-31",
			},
			Type: "payables_outstanding_productions",
		}
		mocked.On("GetPayablesStatsKpiDetails", input.Type, input.From, input.To).Return(data, nil)
		controller := NewPayableStatsController(mocked)

		// Act
		result, fail := controller.GetKpiDetailsByTypeAndDateRange(input)

		// Assert
		assert.NotNil(t, result)
		assert.Nil(t, fail)
		assert.Equal(t, 200, result.Status)
		assert.Equal(t, len(data), len(result.Data))
		assert.Equal(t, data[0].Grouping, result.Data[0].Grouping)
		assert.Equal(t, data[0].GroupingDetails, result.Data[0].GroupingDetails)
		assert.Equal(t, data[0].Value, result.Data[0].Value)
	})
	t.Run("GetKpiDetailsByTypeAndDateRange_Failed", func(t *testing.T) {
		// Arrange
		err := errors.New("unimplemented")
		input := &dtos.DetailRangeDateInput{
			RangeDateInput: &dtos.RangeDateInput{
				From: "2025-02-01",
				To:   "2025-02-07",
			},
			Type: "payables_outstanding_productions",
		}
		mocked.On("GetPayablesStatsKpiDetails", input.Type, input.From, input.To).Return(nil, err)
		controller := NewPayableStatsController(mocked)

		// Act
		result, fail := controller.GetKpiDetailsByTypeAndDateRange(input)

		// Assert
		assert.Nil(t, result)
		assert.NotNil(t, fail)
		assert.Equal(t, 500, fail.Status)
		assert.Equal(t, err.Error(), fail.Data.Detail)
	})
	t.Run("GetKpiStackDetailsByTypeAndDateRange_Successfully", func(t *testing.T) {
		// Arrange
		data := []map[string]interface{}{
			{
				"Test":   100.0,
				"Others": 100.0,
			},
		}
		input := &dtos.DetailRangeDateInput{
			RangeDateInput: &dtos.RangeDateInput{
				From: "2025-01-01",
				To:   "2025-01-31",
			},
			Type: "gross_margin",
		}
		mocked.On("GetPayablesStackStatsKpiDetails", input.Type, input.From, input.To).Return(data, nil)
		controller := NewPayableStatsController(mocked)

		// Act
		result, fail := controller.GetKpiStackDetailsByTypeAndDateRange(input)

		// Assert
		assert.NotNil(t, result)
		assert.Nil(t, fail)
		assert.Equal(t, 200, result.Status)
		assert.Equal(t, len(data), len(result.Data))
		assert.Equal(t, data[0]["Test"], result.Data[0]["Test"])
	})
	t.Run("GetKpiStackDetailsByTypeAndDateRange_Failed", func(t *testing.T) {
		// Arrange
		err := errors.New("unimplemented")
		input := &dtos.DetailRangeDateInput{
			RangeDateInput: &dtos.RangeDateInput{
				From: "2025-02-01",
				To:   "2025-02-07",
			},
			Type: "gross_margin",
		}
		mocked.On("GetPayablesStackStatsKpiDetails", input.Type, input.From, input.To).Return(nil, err)
		controller := NewPayableStatsController(mocked)

		// Act
		result, fail := controller.GetKpiStackDetailsByTypeAndDateRange(input)

		// Assert
		assert.Nil(t, result)
		assert.NotNil(t, fail)
		assert.Equal(t, 500, fail.Status)
		assert.Equal(t, err.Error(), fail.Data.Detail)
	})
}
