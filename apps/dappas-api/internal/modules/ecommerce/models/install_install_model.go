package models

type InstallInput struct {
	Shop string `json:"shop" form:"shop" query:"shop" validate:"required"`
} //@name InstallInput

type InstallOutput struct {
	Url string
} //@name InstallOutput

type InstallPageOutput struct {
	Page    int
	Size    int
	Total   int
	Install []InstallOutput
} //@name InstallPageOutput
