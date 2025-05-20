package shopify

import (
	"context"
	"fmt"

	spf "github.com/bold-commerce/go-shopify/v4"
	"go.uber.org/zap"
	"selector.dev/dappas/internal/app/config"
	"selector.dev/dappas/internal/modules/ecommerce/entities"
)

type ECommerceCustomerService interface {
	Save(customers *entities.Customer) (*uint64, error)
}

type shopifyCustomerService struct {
	config config.IShopifyConfig
	logger *zap.Logger
}

func NewShopifyCustomerService(c config.IShopifyConfig, l *zap.Logger) ECommerceCustomerService {
	return &shopifyCustomerService{
		config: c,
		logger: l,
	}
}
func (s *shopifyCustomerService) Save(customers *entities.Customer) (*uint64, error) {
	app := spf.App{
		ApiKey:    s.config.GetApiKey(),
		ApiSecret: s.config.GetSecret(),
		Scope:     "read_customers,write_customers",
	}

	client, err := spf.NewClient(app, s.config.GetShopName(), s.config.GetAccessToken(), spf.WithRetry(3))
	if err != nil {
		s.logger.Error("Error creating Shopify client", zap.Error(err))
		return nil, fmt.Errorf("error creating Shopify client: %w", err)
	}
	newCustomer := spf.Customer{
		FirstName: customers.User.FirstName,
		LastName:  customers.User.LastName,
		Email:     customers.User.Email,
	}

	customer, err := client.Customer.Create(context.Background(), newCustomer)
	if err != nil {
		s.logger.Error("Error creating customer in Shopify", zap.Error(err))
		return nil, err
	}
	id := customer.Id
	return &id, nil
}
