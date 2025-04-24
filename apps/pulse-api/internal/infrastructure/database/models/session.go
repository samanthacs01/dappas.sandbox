package models

import "time"

type Session struct {
	ID        uint       `db:"name=id auto"`
	UserId    uint       `db:"name=user_id"`
	Token     string     `db:"name=token"`
	CreatedAt time.Time  `db:"name=created_at auto"`
	UpdatedAt time.Time  `db:"name=updated_at auto"`
	DeletedAt *time.Time `db:"name=deleted_at auto"`
}
