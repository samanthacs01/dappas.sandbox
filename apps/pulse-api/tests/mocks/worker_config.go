// Code generated by mockery v2.52.1. DO NOT EDIT.

package mocks

import mock "github.com/stretchr/testify/mock"

// WorkerConfig is an autogenerated mock type for the WorkerConfig type
type WorkerConfig struct {
	mock.Mock
}

// GetBasePath provides a mock function with no fields
func (_m *WorkerConfig) GetBasePath() string {
	ret := _m.Called()

	if len(ret) == 0 {
		panic("no return value specified for GetBasePath")
	}

	var r0 string
	if rf, ok := ret.Get(0).(func() string); ok {
		r0 = rf()
	} else {
		r0 = ret.Get(0).(string)
	}

	return r0
}

// GetProcessorEnv provides a mock function with no fields
func (_m *WorkerConfig) GetProcessorEnv() string {
	ret := _m.Called()

	if len(ret) == 0 {
		panic("no return value specified for GetProcessorEnv")
	}

	var r0 string
	if rf, ok := ret.Get(0).(func() string); ok {
		r0 = rf()
	} else {
		r0 = ret.Get(0).(string)
	}

	return r0
}

// GetProcessorID provides a mock function with no fields
func (_m *WorkerConfig) GetProcessorID() string {
	ret := _m.Called()

	if len(ret) == 0 {
		panic("no return value specified for GetProcessorID")
	}

	var r0 string
	if rf, ok := ret.Get(0).(func() string); ok {
		r0 = rf()
	} else {
		r0 = ret.Get(0).(string)
	}

	return r0
}

// GetProcessorLocation provides a mock function with no fields
func (_m *WorkerConfig) GetProcessorLocation() string {
	ret := _m.Called()

	if len(ret) == 0 {
		panic("no return value specified for GetProcessorLocation")
	}

	var r0 string
	if rf, ok := ret.Get(0).(func() string); ok {
		r0 = rf()
	} else {
		r0 = ret.Get(0).(string)
	}

	return r0
}

// GetProjectNumber provides a mock function with no fields
func (_m *WorkerConfig) GetProjectNumber() string {
	ret := _m.Called()

	if len(ret) == 0 {
		panic("no return value specified for GetProjectNumber")
	}

	var r0 string
	if rf, ok := ret.Get(0).(func() string); ok {
		r0 = rf()
	} else {
		r0 = ret.Get(0).(string)
	}

	return r0
}

// NewWorkerConfig creates a new instance of WorkerConfig. It also registers a testing interface on the mock and a cleanup function to assert the mocks expectations.
// The first argument is typically a *testing.T value.
func NewWorkerConfig(t interface {
	mock.TestingT
	Cleanup(func())
}) *WorkerConfig {
	mock := &WorkerConfig{}
	mock.Mock.Test(t)

	t.Cleanup(func() { mock.AssertExpectations(t) })

	return mock
}
