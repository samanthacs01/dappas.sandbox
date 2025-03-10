package utils

import (
	"reflect"
	"testing"
)

func TestMap(t *testing.T) {
	tests := []struct {
		name     string
		input    []int
		mapFunc  func(int) int
		expected []int
	}{
		{
			name:     "Square of numbers",
			input:    []int{1, 2, 3, 4},
			mapFunc:  func(x int) int { return x * x },
			expected: []int{1, 4, 9, 16},
		},
		{
			name:     "Double of numbers",
			input:    []int{1, 2, 3, 4},
			mapFunc:  func(x int) int { return x * 2 },
			expected: []int{2, 4, 6, 8},
		},
		{
			name:     "Increment numbers",
			input:    []int{1, 2, 3, 4},
			mapFunc:  func(x int) int { return x + 1 },
			expected: []int{2, 3, 4, 5},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			//t.Parallel()
			result := Map(tt.input, tt.mapFunc)
			if !reflect.DeepEqual(result, tt.expected) {
				t.Errorf("Map() = %v, want %v", result, tt.expected)
			}
		})
	}
}
