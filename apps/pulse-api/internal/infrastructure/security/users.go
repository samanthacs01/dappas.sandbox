package security

import (
	"errors"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
	"selector.dev/pulse/config"
	"selector.dev/pulse/internal/domain/shared"
	"selector.dev/pulse/internal/domain/shared/services"
	domain "selector.dev/pulse/internal/domain/user"
)

type userManagement struct {
	emailSender    services.IEmailSender
	userRepository domain.IUserRepository
	emailConfig    config.EmailConfig
}

func NewUserManagement(emailSender services.IEmailSender, userRepository domain.IUserRepository, config config.EmailConfig) services.IUserManagement {
	return &userManagement{
		emailSender:    emailSender,
		userRepository: userRepository,
		emailConfig:    config,
	}
}

func (u *userManagement) InviteNewUser(email string, name string, entity *uint, role shared.Role, tokens map[string]string) error {
	token, err := u.GenerateToken(email)
	if err != nil {
		return err
	}
	first, last := splitFullName(name)
	user := domain.User{
		Email:        email,
		FirstName:    first,
		LastName:     last,
		Role:         role,
		EntityId:     entity,
		Active:       false,
		PasswordHash: *token,
	}
	_, err = u.userRepository.CreateUser(&user)
	if err != nil {
		return err
	}

	return u.SendEmailInvitation(*token, email, role, tokens)
}

func (u *userManagement) SendEmailInvitation(token string, email string, role shared.Role, tokens map[string]string) error {
	template, subject, err := infoFromRole(role)
	if err != nil {
		return err
	}

	tokens["{{confirm_link}}"] = fmt.Sprintf(u.emailConfig.GetConfirmLink(), token, email)
	u.emailSender.SendEmail(email, *subject, *template, tokens)
	return nil
}

func (u *userManagement) ActivateUser(token string, password string) error {
	user, err := u.userRepository.FindUserByToken(token)
	if err != nil {
		return err
	}
	if !user.Active {
		user.Active = true
	}
	_token, err := u.GenerateToken(password)
	if err != nil {
		return err
	}
	user.PasswordHash = *_token
	if err := u.userRepository.UpdateUser(user); err != nil {
		return err
	}
	return nil
}

func (u *userManagement) RecoveryPassword(email string) error {
	user, err := u.userRepository.FindUserByEmail(email)
	if err != nil {
		return err
	}
	token, err := u.GenerateToken(time.Now().String())
	if err != nil {
		return err
	}
	if !user.Active {
		token = &user.PasswordHash
	}

	tokens := map[string]string{
		"{{confirm_link}}": fmt.Sprintf(u.emailConfig.GetConfirmLink(), *token, email),
		"{{entity_name}}":  user.FirstName + " " + user.LastName,
	}
	user.PasswordHash = *token
	user.Active = false

	if err := u.userRepository.UpdateUser(user); err != nil {
		return err
	}

	fmt.Println(tokens)

	subject := "Recovery password"
	template, err := forgotPasswordTemplate()
	if err != nil {
		return err
	}
	return u.emailSender.SendEmail(email, subject, *template, tokens)
}

func readTemplate(path string) (*string, error) {
	templateBytes, err := os.ReadFile(path)
	if err != nil {
		log.Printf("Error reading email template: %v", err)
		return nil, err
	}
	template := string(templateBytes)

	return &template, nil
}

func forgotPasswordTemplate() (*string, error) {
	template, err := readTemplate("./docs/email_templates/account_recovery.html")

	if err != nil {
		log.Printf("Error reading email template: %v", err)
		return nil, err
	}

	return template, nil
}

func infoFromRole(role shared.Role) (*string, *string, error) {
	var subject string
	switch role {
	case shared.RoleAdmin:
		subject = "Invitation to join a new admin"
	case shared.RoleProduction:
		subject = "Invitation to join a new production"
	default:
		return nil, nil, errors.New("invalid role")
	}
	template, err := readTemplate("./docs/email_templates/invitation.html")
	if err != nil {
		return nil, nil, err
	}
	return template, &subject, nil
}

func (u *userManagement) GenerateToken(password string) (*string, error) {
	bytes := []byte(password)
	tokenBytes, err := bcrypt.GenerateFromPassword(bytes, bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	token := string(tokenBytes)
	return &token, nil
}

func (u *userManagement) FindUserByEmail(email string) (*domain.User, error) {
	return u.userRepository.FindUserByEmail(email)
}

func splitFullName(fullName string) (string, string) {
	parts := strings.Fields(fullName)
	if len(parts) == 0 {
		return "", ""
	}
	firstName := strings.Join(parts[:len(parts)-1], " ")
	lastName := parts[len(parts)-1]
	return firstName, lastName
}
