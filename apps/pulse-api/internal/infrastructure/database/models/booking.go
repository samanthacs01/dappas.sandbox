package models

import domain "selector.dev/pulse/internal/domain/booking"

type ViewInsertionOrder struct {
	Id          int       `db:"auto"`
	Payer       string    `db:"name=payer"`
	Number      string    `db:"name=number"`
	Medias      []string  `db:"name=medias"`
	SignedDate  *string   `db:"name=signed_date"`
	Advertisers []*string `db:"name=advertisers"`
	Impressions string    `db:"name=total_io_impressions"`
	NetCost     float64   `db:"name=net_total_io_cost"`
	GrossCost   float64   `db:"name=gross_total_io_cost"`
	Status      string    `db:"name=status"`
	UpperStatus string    `db:"name=upper_ status"`
	UpperPayer  string    `db:"name=upper_ payer"`
}

type ViewFlight struct {
	Id              int      `db:"auto"`
	Identifier      string   `db:"name=identifier"`
	InsertionOrder  string   `db:"name=insertion_order"`
	Payer           string   `db:"name=payer"`
	Advertiser      *string  `db:"name=advertiser"`
	Media           string   `db:"name=media"`
	Production      string   `db:"name=production"`
	TotalCost       float64  `db:"name=total_cost"`
	DropDates       []string `db:"name=drop_dates"`
	Status          string   `db:"name=status"`
	Impressions     int      `db:"name=impressions"`
	UpperStatus     string   `db:"name=upper_status"`
	UpperPayer      string   `db:"name=upper_payer"`
	UpperAdvertiser *string  `db:"name=upper_advertiser"`
	UpperProduction string   `db:"name=upper_production"`
	UpperMedia      string   `db:"name=upper_media"`
}

type ViewIoFlightList struct {
	Id              int      `db:"auto"`
	Identifier      string   `db:"name=identifier"`
	ProductionId    *int     `db:"name=production_id"`
	Length          *string  `db:"name=duration"`
	TotalCost       *float64 `db:"name=total_cost"`
	Cpm             *float64 `db:"name=cpm"`
	DropDates       *string  `db:"name=drop_dates"`
	Production      *string  `db:"name=production_suggested"`
	AdsType         *string  `db:"name=ads_type"`
	Placement       *string  `db:"name=placement"`
	Media           *string  `db:"name=media"`
	Host            *string  `db:"name=host"`
	LivePrerecorded *string  `db:"name=live_prerecorded"`
	Spots           *int     `db:"name=spots"`
	Advertiser      *string  `db:"name=advertiser"`
	Impressions     *int     `db:"name=impressions"`
	PromoCode       *string  `db:"name=promo_code"`
}

type ViewIoDraftList struct {
	Id       int    `db:"auto"`
	Filename string `db:"name=file_name"`
	Filepath string `db:"name=file_path"`
	Status   string `db:"name=status"`
}

func (v *ViewIoDraftList) ToItemList() domain.IoDraftListItem {
	return domain.IoDraftListItem{
		Id:       v.Id,
		Filename: v.Filename,
		Filepath: v.Filepath,
		Status:   domain.IoDraftStatus(v.Status),
	}
}
