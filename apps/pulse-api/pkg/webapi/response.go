package webapi

import (
	"net/http"
)

func NotFound(err error) Failure {
	return Failure{
		Data: ProblemDetails{
			Type:     "https://example.com/probs/not-found",
			Title:    "Not found",
			Status:   http.StatusNotFound,
			Detail:   err.Error(),
			Instance: "",
		},
		Status: http.StatusNotFound,
	}
}

func BadRequest(err error) Failure {
	return Failure{
		Data: ProblemDetails{
			Type:     "https://example.com/probs/invalid-request",
			Title:    "Bad Request",
			Status:   http.StatusBadRequest,
			Detail:   err.Error(),
			Instance: "",
		},
		Status: http.StatusBadRequest,
	}
}

func BadRequestWithCode(err error, code int) Failure {
	return Failure{
		Data: ProblemDetails{
			Type:     "https://example.com/probs/invalid-request",
			Title:    "Bad Request",
			Status:   code,
			Detail:   err.Error(),
			Instance: "",
		},
		Status: http.StatusBadRequest,
	}
}

func Unauthorized(err error) Failure {
	return Failure{
		Data: ProblemDetails{
			Type:     "https://example.com/probs/invalid-request",
			Title:    "Unauthorized",
			Status:   http.StatusUnauthorized,
			Detail:   err.Error(),
			Instance: "",
		},
		Status: http.StatusUnauthorized,
	}
}

func Ok[T interface{}](data T) Result[T] {
	return Result[T]{
		Data:   data,
		Status: http.StatusOK,
	}
}

func OkWithHeaders[T interface{}](data T, headers map[string]string) Result[T] {
	return Result[T]{
		Data:   data,
		Status: http.StatusOK,
		Headers: headers,
	}
}

func Created[T interface{}](data T) Result[T] {
	return Result[T]{
		Data:   data,
		Status: http.StatusCreated,
	}
}
func NoContent() Result[interface{}] {
	return Result[interface{}]{
		Data:   nil,
		Status: http.StatusNoContent,
	}
}

func InternalServerError(err error) Failure {
	return Failure{
		Data: ProblemDetails{
			Type:     "https://example.com/probs/internal-server-error",
			Title:    "Internal Server Error",
			Status:   http.StatusInternalServerError,
			Detail:   err.Error(),
			Instance: "",
		},
		Status: http.StatusInternalServerError,
	}
}

// #region Data Transfer Object

type Result[T interface{}] struct {
	Status int
	Data   T
	Headers map[string]string
}

type Failure Result[ProblemDetails] //@name Failure

type ProblemDetails struct {
	Type     string `json:"type"`
	Title    string `json:"title"`
	Status   int    `json:"status"`
	Detail   string `json:"detail"`
	Instance string `json:"instance"`
} //@name ProblemDetails

// #endregion
