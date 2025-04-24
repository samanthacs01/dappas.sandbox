package models

type ViewPayer struct {
	ID                 uint    `db:"auto"`
	EntityName         string  `db:"name=entity_name"`
	EntityAddress      *string `db:"name=entity_address"`
	ContactName        string  `db:"name=contact_name"`
	ContactPhoneNumber *string `db:"name=contact_phone_number"`
	ContactEmail       string  `db:"name=contact_email"`
	Identifier         string  `db:"name=identifier"`
	PaymentTerms       int     `db:"name=payment_terms"`
}
