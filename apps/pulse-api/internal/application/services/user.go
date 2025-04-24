package services

import (
	"fmt"
	"time"

	"go.uber.org/zap"
	"selector.dev/pulse/internal/application/dtos"
	"selector.dev/pulse/internal/domain/shared"
	"selector.dev/pulse/internal/domain/shared/services"
	domain "selector.dev/pulse/internal/domain/user"
	"selector.dev/pulse/internal/infrastructure/database/models"
	"selector.dev/utils"
)

//go:generate mockery --name=IUserService --output=../../../tests/mocks --filename=user_service.go
type IUserService interface {
	GetUsers(input *dtos.UserFilterInput) (*dtos.Users, error)
	GetUserById(id uint) (*dtos.User, error)
	CreateUser(input *dtos.CreateUserInput) (*dtos.CreatedOutput, error)
	UpdateUser(input *dtos.UpdateUserInput) (*dtos.User, error)
	DeleteUser(id uint) error
	ResendEmail(id uint) error
}

type userService struct {
	logger     *zap.Logger
	repository domain.IUserRepository
	session    services.ISessionServices
	users      services.IUserManagement
}

func NewUserService(logger *zap.Logger, repository domain.IUserRepository, s services.ISessionServices, u services.IUserManagement) IUserService {
	return &userService{
		logger:     logger,
		repository: repository,
		session:    s,
		users:      u,
	}
}

func (s *userService) GetUsers(input *dtos.UserFilterInput) (*dtos.Users, error) {
	s.logger.Info("GetUsers", zap.Any("input", input))

	role := input.Role.Values()
	sorts := input.Sorts.Values()
	page, size := input.Paginate()

	criteria := domain.UserListFilter{
		Search: input.Search,
		Status: input.Status,
		Role:   &role,
		Page:   &page,
		Size:   &size,
		Sorts:  sorts,
	}

	users, total, err := s.repository.FindAllUsers(criteria)
	if err != nil {
		return nil, err
	}

	items := utils.Map(users, func(user models.ViewUser) dtos.User {
		return dtos.User{
			Id:        user.Id,
			FirstName: user.FirstName,
			LastName:  user.LastName,
			Email:     user.Email,
			Status:    user.Active,
			Role:      user.Role,
		}
	})

	result := dtos.Users{
		Items: items,
		Pagination: dtos.PaginationInfo{
			Page:    page,
			PerPage: size,
			Total:   *total,
		},
	}

	return &result, nil
}

func (s *userService) GetUserById(id uint) (*dtos.User, error) {
	user, err := s.repository.FindUserById(id)
	if err != nil {
		return nil, err
	}

	result := dtos.User{
		Id:        user.Id,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Email:     user.Email,
		Status:    user.Active,
		Role:      user.Role,
	}

	return &result, nil
}

func (s *userService) ResendEmail(id uint) error {
	user, err := s.repository.FindUserById(id)
	if err != nil {
		return err
	}

	token, err := s.users.GenerateToken(time.Now().String())
	if err != nil {
		return err
	}
	userUpdate := domain.User{
		Id:           user.Id,
		PasswordHash: *token,
		Active:       user.Active,
	}

	if err := s.repository.UpdateUser(&userUpdate); err != nil {
		return err
	}
	return s.sendEmailInvitation(user.FirstName, user.LastName, user.Email, user.Role, *token)
}

func (r *userService) sendEmailInvitation(firstName string, lastName string, email string, role shared.Role, token string) error {
	now := time.Now()
	tokens := map[string]string{
		"{{entity_name}}":   fmt.Sprintf("%s %s", firstName, lastName),
		"{{contact_name}}":  fmt.Sprintf("%s %s", firstName, lastName),
		"{{contact_email}}": email,
		"{{creation_date}}": now.Format("Jan 02, 2006"),
	}
	return r.users.SendEmailInvitation(token, email, role, tokens)
}

func (s *userService) CreateUser(input *dtos.CreateUserInput) (*dtos.CreatedOutput, error) {
	token, err := s.users.GenerateToken(input.Email)
	if err != nil {
		return nil, err
	}

	user := domain.User{
		FirstName:    input.FirstName,
		LastName:     input.LastName,
		Email:        input.Email,
		Role:         input.Role,
		Active:       false,
		PasswordHash: *token,
	}

	created, err := s.repository.CreateUser(&user)
	if err != nil {
		return nil, err
	}

	if err := s.sendEmailInvitation(user.FirstName, user.LastName, user.Email, user.Role, *token); err != nil {
		s.logger.Warn("Could not send email invitation to user", zap.Error(err), zap.String("user", user.Email))
	}

	result := dtos.CreatedOutput{
		Id: *created,
	}

	return &result, nil
}

func (s *userService) UpdateUser(input *dtos.UpdateUserInput) (*dtos.User, error) {
	user := domain.User{
		Id:        input.Id,
		FirstName: input.FirstName,
		LastName:  input.LastName,
		Role:      input.Role,
	}

	err := s.repository.UpdateUserData(&user)
	if err != nil {
		s.logger.Error("Error updating user", zap.Any("error", err))
		return nil, err
	}

	return s.GetUserById(user.Id)
}

func (s *userService) DeleteUser(id uint) error {
	userId := s.session.GetUserId()

	err := s.repository.DeleteUser(id, userId)
	if err != nil {
		return err
	}

	return nil
}
