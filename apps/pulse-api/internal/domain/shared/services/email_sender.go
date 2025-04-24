package services

type IEmailSender interface {
	SendEmail(to string, subject string, body string, tokens map[string]string) error
}
