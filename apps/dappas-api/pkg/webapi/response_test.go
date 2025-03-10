package webapi

import (
	"errors"
	"testing"
)

func TestBadRequest(t *testing.T) {
	err := errors.New("Invalid request")
	expectedStatus := 400

	result := BadRequest(err)
	data, ok := result.Data.(problemDetails)
	if !ok {
		t.Errorf("NotFound() = %v, want %v", result.Data, problemDetails{})
	}
	if data.Detail != err.Error() {
		t.Errorf("BadRequest() = %v, want %v", data.Detail, err.Error())
	}
	if result.Status != expectedStatus {
		t.Errorf("BadRequest() = %v, want %v", result.Status, expectedStatus)
	}
}

func TestNotFound(t *testing.T) {
	err := errors.New("Resource not found")
	expectedStatus := 404

	result := NotFound(err)
	data, ok := result.Data.(problemDetails)
	if !ok {
		t.Errorf("NotFound() = %v, want %v", result.Data, problemDetails{})
	}
	if  data.Detail != err.Error() {
		t.Errorf("NotFound() = %v, want %v", data.Detail, err.Error())
	}
	if result.Status != expectedStatus {
		t.Errorf("NotFound() = %v, want %v", result.Status, expectedStatus)
	}
}

func TestInternalServerError(t *testing.T) {
	err := errors.New("Internal Server error")
	expectedStatus := 500

	result := InternalServerError(err)
	data, ok := result.Data.(problemDetails)
	if !ok {
		t.Errorf("NotFound() = %v, want %v", result.Data, problemDetails{})
	}
	if data.Detail != err.Error() {
		t.Errorf("NotFound() = %v, want %v", data.Detail, err.Error())
	}
	if result.Status != expectedStatus {
		t.Errorf("NotFound() = %v, want %v", result.Status, expectedStatus)
	}
}

func TestOk(t *testing.T) {
	data := "Success"

	result := Ok(data)

	if result.Data != data {
		t.Errorf("Ok() = %v, want %v", result.Data, data)
	}
	if result.Status != 200 {
		t.Errorf("Ok() = %v, want %v", result.Status, 200)
	}
}
