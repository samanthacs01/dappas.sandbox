package model

type LogoutInput struct {
	Authorization string `header:"Authorization"`
}

func (input *LogoutInput) Validate() error {
	return nil
}

func (input *LogoutInput) Token() string {
	return ""
}
