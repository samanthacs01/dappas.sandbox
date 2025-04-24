package user

import (
	"time"

	"golang.org/x/crypto/bcrypt"
	"selector.dev/pulse/internal/domain/shared"
)

type User struct {
	Id           uint        `db:"name=id"`
	FirstName    string      `db:"name=first_name"`
	LastName     string      `db:"name=last_name"`
	Email        string      `db:"name=email"`
	PasswordHash string      `db:"name=password_hash"`
	Role         shared.Role `db:"name=role"`
	Active       bool        `db:"name=active"`
	EntityId     *uint       `db:"name=entity_id"`
	CreatedAt    time.Time   `db:"name=created_at"`
	UpdatedAt    time.Time   `db:"name=updated_at"`
	DeletedAt    *time.Time  `db:"name=deleted_at"`
}

// CheckPassword checks if the provided password matches the stored hash
func (u *User) CheckPassword(password string) bool {
	bytes := []byte(password)
	err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), bytes)
	return err == nil
}

type UserListFilter struct {
	Search *string
	Role   *[]string
	Status *bool
	Sorts  []struct{ Field, Direction string }
	Page   *int
	Size   *int
}

func (f *UserListFilter) GetSorts() []struct{ Field, Direction string } {
	_sorts := f.Sorts
	_sorts = append(_sorts, struct{ Field, Direction string }{"id", "desc"})
	return _sorts
}
