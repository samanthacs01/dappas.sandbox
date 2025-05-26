package hooks

import "selector.dev/security/entities"

type IUseSaveHooks interface {
	BeforeSave(user *entities.User) error
	AfterSave(user *entities.User) error
}
