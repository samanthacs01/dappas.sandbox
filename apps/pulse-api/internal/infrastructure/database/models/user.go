package models

import "selector.dev/pulse/internal/domain/shared"

type ViewUser struct {
	Id        uint        `db:"auto"`
	FirstName string      `db:"name=first_name"`
	LastName  string      `db:"name=last_name"`
	Email     string      `db:"name=email"`
	Role      shared.Role `db:"name=role"`
	Active    bool        `db:"name=active"`
}
