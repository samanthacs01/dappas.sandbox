package usecases

import (
	"crypto"
	"errors"
	"fmt"
	"net/url"

	"selector.dev/dappas/internal/app/config"
	"selector.dev/dappas/internal/modules/ecommerce/models"
)

//go:generate mockgen -destination=../mocks/mock_install_shopify_usecase.go -package=mocks selector.dev/dappas/internal/modules/ecommerce/usecases IShopifyInstallUseCase
type IShopifyInstallUseCase interface {
	Run(input *models.InstallInput) (*models.InstallOutput, error)
}

type shopifyInstallUseCase struct {
	config config.IShopifyConfig
}

func NewShopifyInstallUseCase(c config.IShopifyConfig) IShopifyInstallUseCase {
	return &shopifyInstallUseCase{config: c}
}

func (u *shopifyInstallUseCase) Run(input *models.InstallInput) (*models.InstallOutput, error) {
	if input.Shop == "" {
		return nil, errors.New("shop parameter is required")
	}
	if input.Shop[len(input.Shop)-1:] == "/" {
		input.Shop = input.Shop[:len(input.Shop)-1]
	}

	params := url.Values{}
	params.Add("client_id", u.config.GetApiKey())
	params.Add("scope", u.config.GetScopes())
	params.Add("redirect_uri", u.config.GetRedirectUri())
	params.Add("state", getState(input.Shop))
	fullUrl := fmt.Sprintf("https://%s/admin/oauth/authorize?%s", input.Shop, params.Encode())
	result := &models.InstallOutput{
		Url: fullUrl,
	}
	return result, nil
}

func getState(shop string) string {
	hasher := crypto.MD5.New()
	hasher.Write([]byte(shop))
	hash := hasher.Sum(nil)
	return string(hash)
}
