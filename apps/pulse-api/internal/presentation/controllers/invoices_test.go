package controllers

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"go.uber.org/zap"
	"selector.dev/pulse/internal/application/dtos"
	"selector.dev/pulse/internal/domain/booking"
	"selector.dev/pulse/internal/domain/receivables"
	"selector.dev/pulse/tests/mocks"
)

func TestInvoicesController(t *testing.T) {
	t.Run("get invoices successfully with default input", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewIInvoicesService(t)
		ctrl := NewInvoicesController(mocked, zap.L().WithOptions())
		data := &dtos.Invoices{
			Items: []receivables.InvoiceListItem{
				{
					Id:         1,
					Identifier: "Invoice 1",
				},
			},
		}
		input := dtos.ListWithFilterInput{}
		mocked.On("GetInvoices", &input).Return(data, nil)
		// Act
		success, fail := ctrl.GetInvoices(&input)
		// Assert
		assert.NotNil(t, success)
		assert.Nil(t, fail)
		assert.Equal(t, len(data.Items), len(success.Data.Items))
		assert.Equal(t, data.Pagination.Total, success.Data.Pagination.Total)
	})
	t.Run("get invoices fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewIInvoicesService(t)
		ctrl := NewInvoicesController(mocked, zap.L().WithOptions())
		input := dtos.ListWithFilterInput{}
		mocked.On("GetInvoices", &input).Return(nil, assert.AnError)
		// Act
		success, fail := ctrl.GetInvoices(&input)
		// Assert
		assert.Nil(t, success)
		assert.NotNil(t, fail)
		assert.Equal(t, 500, fail.Status)
	})
	t.Run("generate invoice successfully", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewIInvoicesService(t)
		ctrl := NewInvoicesController(mocked, zap.L().WithOptions())
		input := &dtos.GenerateBillsInput{
			Flights: []int{1},
		}
		data := &[]receivables.DraftInvoice{
			{
				Id:    1,
				Payer: "Payer 1",
			},
		}
		mocked.On("GenerateBills", input).Return(data, nil)
		// Act
		success, fail := ctrl.GenerateBills(input)
		// Assert
		assert.NotNil(t, success)
		assert.Nil(t, fail)
	})
	t.Run("generate invoice bad request fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewIInvoicesService(t)
		ctrl := NewInvoicesController(mocked, zap.L().WithOptions())
		input := &dtos.GenerateBillsInput{}
		// Act
		success, fail := ctrl.GenerateBills(input)
		// Assert
		assert.Nil(t, success)
		assert.NotNil(t, fail)
		assert.Equal(t, 400, fail.Status)
	})
	t.Run("generate invoice fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewIInvoicesService(t)
		ctrl := NewInvoicesController(mocked, zap.L().WithOptions())
		input := &dtos.GenerateBillsInput{
			Flights: []int{1},
		}
		mocked.On("GenerateBills", input).Return(nil, assert.AnError)
		// Act
		success, fail := ctrl.GenerateBills(input)
		// Assert
		assert.Nil(t, success)
		assert.NotNil(t, fail)
		assert.Equal(t, 500, fail.Status)
	})
	t.Run("generate invoice flights are invoiced fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewIInvoicesService(t)
		ctrl := NewInvoicesController(mocked, zap.L().WithOptions())
		input := &dtos.GenerateBillsInput{
			Flights: []int{1},
		}
		mocked.On("GenerateBills", input).Return(nil, booking.ErrFlightsAlreadyInvoiced)
		// Act
		success, fail := ctrl.GenerateBills(input)
		// Assert
		assert.Nil(t, success)
		assert.NotNil(t, fail)
		assert.Equal(t, 400, fail.Status)
	})
	t.Run("register payment invoice successfully", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewIInvoicesService(t)
		ctrl := NewInvoicesController(mocked, zap.L().WithOptions())
		input := &dtos.RegisterPaymentInput{
			Id:     1,
			Amount: 100,
		}
		mocked.On("RegisterPayment", input).Return(nil)
		// Act
		success, fail := ctrl.RegisterPayment(input)
		// Assert
		assert.NotNil(t, success)
		assert.Nil(t, fail)
	})
	t.Run("register payment invoice fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewIInvoicesService(t)
		ctrl := NewInvoicesController(mocked, zap.L().WithOptions())
		input := &dtos.RegisterPaymentInput{
			Id: 1,
		}

		// Act
		success, fail := ctrl.RegisterPayment(input)
		// Assert
		assert.Nil(t, success)
		assert.NotNil(t, fail)
		assert.Equal(t, 400, fail.Status)
	})

	t.Run("register payment invoice fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewIInvoicesService(t)
		ctrl := NewInvoicesController(mocked, zap.L().WithOptions())
		input := &dtos.RegisterPaymentInput{
			Id:     1,
			Amount: 100,
		}
		mocked.On("RegisterPayment", input).Return(assert.AnError)
		// Act
		success, fail := ctrl.RegisterPayment(input)
		// Assert
		assert.Nil(t, success)
		assert.NotNil(t, fail)
		assert.Equal(t, 500, fail.Status)
	})
	t.Run("accept generated bills successfully", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewIInvoicesService(t)
		ctrl := NewInvoicesController(mocked, zap.L().WithOptions())
		input := &dtos.AcceptGeneratedBillingInput{
			Invoices: []int{1},
		}
		mocked.On("AcceptGeneratedBills", input).Return(nil)
		// Act
		success, fail := ctrl.AcceptGeneratedBills(input)
		// Assert
		assert.NotNil(t, success)
		assert.Nil(t, fail)
	})
	t.Run("accept generated bills fails", func(t *testing.T) {
		// Arrange
		mocked := mocks.NewIInvoicesService(t)
		ctrl := NewInvoicesController(mocked, zap.L().WithOptions())
		input := &dtos.AcceptGeneratedBillingInput{
			Invoices: []int{1},
		}
		mocked.On("AcceptGeneratedBills", input).Return(assert.AnError)
		// Act
		success, fail := ctrl.AcceptGeneratedBills(input)
		// Assert
		assert.Nil(t, success)
		assert.NotNil(t, fail)
		assert.Equal(t, 500, fail.Status)
	})
}

func TestConvertPointerSliceToStringSlice(t *testing.T) {
	t.Run("convert pointer slice to string slice", func(t *testing.T) {
		// Arrange
		work := "work"
		input := []*string{nil, &work}
		// Act
		output := convertPointerSliceToStringSlice(input)
		// Assert
		assert.Equal(t, []string{"", work}, output)
	})
}
