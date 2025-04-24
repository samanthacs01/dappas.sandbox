package controllers

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"selector.dev/pulse/internal/application/dtos"
	"selector.dev/pulse/internal/domain/overview"
	"selector.dev/pulse/tests/mocks"
)

func TestOverviewStatsController_GetKpiByDateRange(t *testing.T) {
	mocked := mocks.NewIOverviewRepository(t)

	// Scenario successfully
	t.Run("Successfully", func(t *testing.T) {
		_total := 100.0
		_grossMargin := 15.5
		_dpo := 20.0
		_dso := 10.0
		mocked.On("GetOverviewStatsKpi", "2025-01-01", "2025-01-31").Return(&overview.OverviewStats{
			TotalRevenue: &_total,
			GrossMargin:  &_grossMargin,
			Dso:          &_dso,
			Dpo:          &_dpo,
		}, nil)
		// Arrange
		controller := NewOverviewStatsController(mocked)
		input := &dtos.RangeDateInput{
			From: "2025-01-01",
			To:   "2025-01-31",
		}

		// Act
		result, fail := controller.GetKpiByDateRange(input)

		// Assert
		assert.NotNil(t, result)
		assert.Nil(t, fail)
		assert.Equal(t, 200, result.Status)
		assert.Equal(t, &_total, result.Data.TotalRevenue)
		assert.Equal(t, &_grossMargin, result.Data.GrossMargin)
		assert.Equal(t, &_dso, result.Data.Dso)
		assert.Equal(t, &_dpo, result.Data.Dpo)
	})

	t.Run("Fail", func(t *testing.T) {
		// Arrange
		mocked.On("GetOverviewStatsKpi", "2025-01-01", "2024-01-31").Return(nil, errors.New("invalid date range"))
		controller := NewOverviewStatsController(mocked)
		input := &dtos.RangeDateInput{
			From: "2025-01-01",
			To:   "2024-01-31",
		}

		// Act
		result, fail := controller.GetKpiByDateRange(input)

		// Assert
		assert.Nil(t, result)
		assert.NotNil(t, fail)

		assert.Equal(t, 500, fail.Status)
		assert.Equal(t, "invalid date range", fail.Data.Detail)
	})
}

func TestOverviewStatsController_GetKpiDetailsByDpoAndDateRange(t *testing.T) {
	mocked := mocks.NewIOverviewRepository(t)
	t.Run("Successfully", func(t *testing.T) {
		// Arrange
		data := []overview.OverviewKpiDetailsItemWithComposeValue{
			{
				Grouping:        "Test",
				Compose:         100.0,
				Value:           50.0,
				GroupingDetails: "Test details",
			},
		}
		mocked.On("GetOverviewStatsKpiDetailsWithCompose", "dpo", "2025-01-01", "2025-01-31").Return(data, nil)
		controller := NewOverviewStatsController(mocked)
		input := &dtos.RangeDateInput{
			From: "2025-01-01",
			To:   "2025-01-31",
		}

		// Act
		result, fail := controller.GetKpiDetailsByDpoAndDateRange(input)

		// Assert
		assert.NotNil(t, result)
		assert.Nil(t, fail)

		assert.Equal(t, 200, result.Status)
		assert.Equal(t, len(data), len(result.Data))
		assert.Equal(t, data[0].Grouping, result.Data[0].Grouping)
		assert.Equal(t, data[0].Compose, result.Data[0].Compose)
		assert.Equal(t, data[0].Value, result.Data[0].Value)
		assert.Equal(t, data[0].GroupingDetails, result.Data[0].GroupingDetails)
	})
	t.Run("Failure", func(t *testing.T) {
		// Arrange
		mocked.On("GetOverviewStatsKpiDetailsWithCompose", "dpo", "2025-02-01", "2025-02-07").Return(nil, errors.New("unimplemented"))
		controller := NewOverviewStatsController(mocked)
		input := &dtos.RangeDateInput{
			From: "2025-02-01",
			To:   "2025-02-07",
		}

		// Act
		result, fail := controller.GetKpiDetailsByDpoAndDateRange(input)

		// Assert
		assert.Nil(t, result)
		assert.NotNil(t, fail)

		assert.Equal(t, 500, fail.Status)
		assert.Equal(t, "unimplemented", fail.Data.Detail)
	})
}

func TestOverviewStatsController_GetKpiDetailsByDsoAndDateRange(t *testing.T) {
	mocked := mocks.NewIOverviewRepository(t)
	t.Run("Successfully", func(t *testing.T) {
		// Arrange
		data := []overview.OverviewKpiDetailsItemWithComposeValue{
			{
				Grouping:        "Test",
				Compose:         100.0,
				Value:           50.0,
				GroupingDetails: "Test details",
			},
		}
		mocked.On("GetOverviewStatsKpiDetailsWithCompose", "dso", "2025-01-01", "2025-01-31").Return(data, nil)
		controller := NewOverviewStatsController(mocked)
		input := &dtos.RangeDateInput{
			From: "2025-01-01",
			To:   "2025-01-31",
		}

		// Act
		result, fail := controller.GetKpiDetailsByDsoAndDateRange(input)

		// Assert
		assert.NotNil(t, result)
		assert.Nil(t, fail)

		assert.Equal(t, 200, result.Status)
		assert.Equal(t, 1, len(result.Data))
	})
	t.Run("Failure", func(t *testing.T) {
		// Arrange
		mocked.On("GetOverviewStatsKpiDetailsWithCompose", "dso", "2025-02-01", "2025-02-07").Return(nil, errors.New("unimplemented"))
		controller := NewOverviewStatsController(mocked)
		input := &dtos.RangeDateInput{
			From: "2025-02-01",
			To:   "2025-02-07",
		}

		// Act
		result, fail := controller.GetKpiDetailsByDsoAndDateRange(input)

		// Assert
		assert.Nil(t, result)
		assert.NotNil(t, fail)

		assert.Equal(t, 500, fail.Status)
		assert.Equal(t, "unimplemented", fail.Data.Detail)
	})
}

func TestOverviewStatsController_GetKpiStackDetailsByTypeAndDateRange(t *testing.T) {
	mocked := mocks.NewIOverviewRepository(t)
	t.Run("Successfully", func(t *testing.T) {
		// Arrange
		data := []map[string]interface{}{
			{
				"Test":   100.0,
				"Others": 1000.0,
			},
		}
		mocked.On("GetOverviewStackStatsKpiDetails", "gross_margin", "2025-01-01", "2025-01-31").Return(data, nil)
		controller := NewOverviewStatsController(mocked)
		input := &dtos.RangeDateInput{
			From: "2025-01-01",
			To:   "2025-01-31",
		}

		// Act
		result, fail := controller.GetKpiStackDetailsByTypeAndDateRange(input)
		// Assert
		assert.NotNil(t, result)
		assert.Nil(t, fail)

		assert.Equal(t, 200, result.Status)
		assert.Equal(t, len(data), len(result.Data))
		assert.NotNil(t, result.Data[0]["Test"])
		assert.Equal(t, data[0]["Test"], result.Data[0]["Test"])
		assert.NotNil(t, result.Data[0]["Others"])
		assert.Equal(t, data[0]["Others"], result.Data[0]["Others"])
	})

	t.Run("Failure", func(t *testing.T) {
		// Arrange
		mocked.On("GetOverviewStackStatsKpiDetails", "gross_margin", "2025-02-01", "2025-02-07").Return(nil, errors.New("unimplemented"))
		controller := NewOverviewStatsController(mocked)
		input := &dtos.RangeDateInput{
			From: "2025-02-01",
			To:   "2025-02-07",
		}

		// Act
		result, fail := controller.GetKpiStackDetailsByTypeAndDateRange(input)

		// Assert
		assert.Nil(t, result)
		assert.NotNil(t, fail)

		assert.Equal(t, 500, fail.Status)
		assert.Equal(t, "unimplemented", fail.Data.Detail)
	})
}

func TestOverviewStatsController_GetKpiDetailsByTotalRevenueAndDateRange(t *testing.T) {
	mocked := mocks.NewIOverviewRepository(t)
	t.Run("Successfully", func(t *testing.T) {
		// Arrange
		data := []overview.OverviewKpiDetailsItem{
			{
				Grouping:        "Test",
				Value:           100.0,
				GroupingDetails: "Test details",
			},
		}
		mocked.On("GetOverviewStatsKpiDetails", "overview_total_revenue", "2025-01-01", "2025-01-31").Return(data, nil)
		controller := NewOverviewStatsController(mocked)
		input := &dtos.RangeDateInput{
			From: "2025-01-01",
			To:   "2025-01-31",
		}

		// Act
		result, fail := controller.GetKpiDetailsByTotalRevenueAndDateRange(input)
		// Assert
		assert.NotNil(t, result)
		assert.Nil(t, fail)

		assert.Equal(t, 200, result.Status)
		assert.Equal(t, len(data), len(result.Data))
		assert.Equal(t, data[0].Grouping, result.Data[0].Grouping)
		assert.Equal(t, data[0].Value, result.Data[0].Value)
		assert.Equal(t, data[0].GroupingDetails, result.Data[0].GroupingDetails)
	})

	t.Run("Failure", func(t *testing.T) {
		// Arrange
		mocked.On("GetOverviewStatsKpiDetails", "overview_total_revenue", "2025-02-01", "2025-02-07").Return(nil, errors.New("unimplemented"))
		controller := NewOverviewStatsController(mocked)
		input := &dtos.RangeDateInput{
			From: "2025-02-01",
			To:   "2025-02-07",
		}

		// Act
		result, fail := controller.GetKpiDetailsByTotalRevenueAndDateRange(input)

		// Assert
		assert.Nil(t, result)
		assert.NotNil(t, fail)

		assert.Equal(t, 500, fail.Status)
		assert.Equal(t, "unimplemented", fail.Data.Detail)
	})
}
