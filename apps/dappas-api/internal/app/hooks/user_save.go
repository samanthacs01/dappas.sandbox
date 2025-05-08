package hooks

import (
	"selector.dev/security/entities"
	security "selector.dev/security/repositories/hooks"
)

type userSaveHooks struct {
}

func NewUserSaveHooks() security.IUseSaveHooks {
	return &userSaveHooks{}
}
func (h *userSaveHooks) BeforeSave(user *entities.User) error {
	// Implement your logic here
	return nil
}
func (h *userSaveHooks) AfterSave(user *entities.User) error {
	// Implement your logic here
	return nil
}
