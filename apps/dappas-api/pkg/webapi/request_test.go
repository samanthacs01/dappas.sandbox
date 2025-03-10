package webapi

import "testing"

func TestRequests(t *testing.T) {
	t.Run("Test CSIntList", func(t *testing.T) {
		c := CSIntList("1,2,3")
		if len(c.Values()) != 3 {
			t.Errorf("Expected 3, got %d", len(c.Values()))
		}
	})

	t.Run("Test CSStringList", func(t *testing.T) {
		c := CSStringList("aa,12w,ass3")
		if len(c.Values()) != 3 {
			t.Errorf("Expected 3, got %d", len(c.Values()))
		}
	})
}
