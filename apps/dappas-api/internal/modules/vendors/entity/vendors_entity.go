package entity

type Vendor struct {
	Id           int64   `json:"id" db:"id;auto"`
	CompanyName  string  `json:"company_name" db:"company_name"`
	ContactEmail string  `json:"contact_email" db:"contact_email"`
	ContactPhone string  `json:"contact_phone" db:"contact_phone"`
	Address      string  `json:"address" db:"address"`
	CreatedAt    string  `json:"created_at" db:"created_at;auto"`
	UpdatedAt    string  `json:"updated_at" db:"updated_at;auto"`
	DeletedAt    *string `json:"deleted_at" db:"deleted_at;auto"`
}

type VendorProductSettings struct {
	Id                int64   `json:"id" db:"id;auto"`
	VendorId          int64   `json:"vendor_id" db:"vendor_id"`
	ProductCategoryId int64   `json:"product_category_id" db:"product_type_id"`
	SizeId            int64   `json:"size_id" db:"size_id"`
	MaterialId        int64   `json:"material_id" db:"material_id"`
	Price             float64 `json:"price" db:"price"`
	Capacity          int     `json:"capacity" db:"capacity"`
	CreatedAt         string  `json:"created_at" db:"created_at;auto"`
	UpdatedAt         string  `json:"updated_at" db:"updated_at;auto"`
	DeletedAt         *string `json:"deleted_at" db:"deleted_at;auto"`
}
