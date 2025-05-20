package webapi

import (
	"net/http"
)


func NotFound(err error) Result {
	return Result{
		Data: problemDetails{
			Type:     "https://example.com/probs/not-found",
			Title:    "Not found",
			Status:   http.StatusNotFound,
			Detail:   err.Error(),
			Instance: "",
		},
		Status: http.StatusNotFound,
	}
}

func BadRequest(err error) Result {
	return Result{
		Data: problemDetails{
			Type:     "bad-request",
			Title:    "Bad Request",
			Status:   http.StatusBadRequest,
			Detail:   err.Error(),
			Instance: "",
		},
		Status: http.StatusBadRequest,
	}
}

func BadRequestWithCode(err error, code int) Result {
	return Result{
		Data: problemDetails{
			Type:     "bad-request",
			Title:    "Bad Request",
			Status:   code,
			Detail:   err.Error(),
			Instance: "",
		},
		Status: http.StatusBadRequest,
	}
}

func Unauthorized(err error) Result {
	return Result{
		Data: problemDetails{
			Type:     "unauthorized",
			Title:    "Unauthorized",
			Status:   http.StatusUnauthorized,
			Detail:   err.Error(),
			Instance: "",
		},
		Status: http.StatusUnauthorized,
	}
}

func Ok(data interface{}) Result {
	return Result{
		Data:   data,
		Status: http.StatusOK,
	}
}

func OkWithHeaders(data interface{}, headers map[string]string) Result {
	return Result{
		Data:   data,
		Status: http.StatusOK,
		Headers: &headers,
	}
}

func Created(data interface{}) Result {
	return Result{
		Data:   data,
		Status: http.StatusCreated,
	}
}
func NoContent() Result {
	return Result{
		Data:   nil,
		Status: http.StatusNoContent,
	}
}

func InternalServerError(err error) Result {
	problem := problemDetails{
		Type:     "internal-server-error",
		Title:    "Internal Server Error",
		Status:   http.StatusInternalServerError,
		Detail:   err.Error(),
		Instance: "",
	}
	return Result{
		Data: problem,
		Status: http.StatusInternalServerError,
	}
}

func Redirect(url string) Result {
	return Result{
		Data:   nil,
		Status: http.StatusFound,
		Headers: &map[string]string{
			"Location": url,
		},
	}
}