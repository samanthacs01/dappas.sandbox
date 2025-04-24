package shared

type LoggedUser struct {
	Name  string `json:"name"`
	Email string `json:"email"`
	Role  Role   `json:"role"`
}

type Session struct {
	Token    string     `json:"token"`
	Role     Role       `json:"role"`
	ExpireIn int64      `json:"expire_in"`
	UserId   uint       `json:"-"`
	User     LoggedUser `json:"user"`
} //AuthResponse
