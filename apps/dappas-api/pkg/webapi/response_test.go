package webapi

import (
	"errors"
	"testing"
)

func TestBadRequest(t *testing.T) {
	errorPattern := "BadRequest() = %v, want %v"
	err := errors.New("Invalid request")
	expectedStatus := 400

	result := BadRequest(err)
	data, ok := result.Data.(problemDetails)
	if !ok {
		t.Errorf(errorPattern, result.Data, problemDetails{})
	}
	if data.Detail != err.Error() {
		t.Errorf(errorPattern, data.Detail, err.Error())
	}
	if result.Status != expectedStatus {
		t.Errorf(errorPattern, result.Status, expectedStatus)
	}
}

func TestNotFound(t *testing.T) {
	const errorPattern = "NotFound() = %v, want %v"
	err := errors.New("Resource not found")
	expectedStatus := 404

	result := NotFound(err)
	data, ok := result.Data.(problemDetails)
	if !ok {
		t.Errorf(errorPattern, result.Data, problemDetails{})
	}
	if  data.Detail != err.Error() {
		t.Errorf(errorPattern, data.Detail, err.Error())
	}
	if result.Status != expectedStatus {
		t.Errorf(errorPattern, result.Status, expectedStatus)
	}
}

func TestInternalServerError(t *testing.T) {
	const errorPattern = "InternalServerError() = %v, want %v"
	err := errors.New("Internal Server error")
	expectedStatus := 500

	result := InternalServerError(err)
	data, ok := result.Data.(problemDetails)
	if !ok {
		t.Errorf(errorPattern, result.Data, problemDetails{})
	}
	if data.Detail != err.Error() {
		t.Errorf(errorPattern, data.Detail, err.Error())
	}
	if result.Status != expectedStatus {
		t.Errorf(errorPattern, result.Status, expectedStatus)
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
