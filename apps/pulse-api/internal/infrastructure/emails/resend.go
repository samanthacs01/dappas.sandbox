package emails

import (
	"context"
	"fmt"
	"os/exec"
	"strings"
	"time"

	"github.com/resend/resend-go/v2"
	"go.uber.org/zap"
	"selector.dev/pulse/config"
	"selector.dev/pulse/internal/domain/shared/services"
)

type resendEmailSender struct {
	logger *zap.Logger
	config config.EmailConfig
}

func NewResendEmailSender(l *zap.Logger, cfg config.EmailConfig) services.IEmailSender {
	return &resendEmailSender{
		logger: l,
		config: cfg,
	}
}

func (s *resendEmailSender) SendEmail(to string, subject string, bodyTemplate string, tokens map[string]string) error {
	from := s.config.GetFromEmail()
	replyTo := s.config.GetSupportEmail()
	_tokens := map[string]string{
		"{{support_email}}": s.config.GetSupportEmail(),
		"{{logo_url}}":      s.config.GetLogoUrl(),
	}

	for k, v := range tokens {
		_tokens[k] = v
	}

	for k, v := range _tokens {
		bodyTemplate = strings.ReplaceAll(bodyTemplate, k, v)
	}

	client := resend.NewClient(s.config.GetResendEmailApiKey())

	params := &resend.SendEmailRequest{
		From:    from,
		To:      []string{to},
		Html:    bodyTemplate,
		Subject: subject,
		ReplyTo: replyTo,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	maxRetries := 3
	for i := 0; i < maxRetries; i++ {
		sent, err := client.Emails.SendWithContext(ctx, params)
		if err != nil {
			s.logger.Error("Error sending email", zap.Error(err))
			if err := s.pingService(); err != nil {
				s.logger.Error("Error pinging email service", zap.Error(err))
			}
			if i < maxRetries-1 {
				s.logger.Info("Retrying to send email", zap.Int("attempt", i+1))
				time.Sleep(2 * time.Second)
				continue
			}
			return err
		}

		s.logger.Info("Email sent successfully", zap.String("email_id", sent.Id))
		return nil
	}

	return fmt.Errorf("failed to send email after %d attempts", maxRetries)
}

func (s *resendEmailSender) pingService() error {
	cmd := exec.Command("ping", "-c", "1", "api.resend.com")
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("ping failed: %v, output: %s", err, string(output))
	}
	return nil
}
