package models

type ListVendorsInput struct {
} //@name ListVendorsInput

type ListVendorsOutput struct {
} //@name ListVendorsOutput

type ListVendorsPageOutput struct {
	Page        int
	Size        int
	Total       int
	ListVendors []ListVendorsOutput
} //@name ListVendorsPageOutput
