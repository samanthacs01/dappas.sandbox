package booking

import (
	"strings"
	"time"
)

type InsertionOrder struct {
	Id          int                  `db:"auto"`
	PayerId     int                  `db:"name=payer_id"`
	Number      string               `db:"name=number"`
	SignedDate  string               `db:"name=signed_at"`
	Impressions *int                 `db:"name=total_io_impressions"`
	NetCost     float64              `db:"name=net_total_io_cost"`
	GrossCost   *float64             `db:"name=gross_total_io_cost"`
	Status      InsertionOrderStatus `db:"name=status"`
	ChangeBy    *string              `db:"name=change_by"`
	CreatedAt   time.Time            `db:"name=created_at auto"`
	UpdatedAt   time.Time            `db:"name=updated_at auto"`
	DeletedAt   *time.Time           `db:"name=deleted_at auto"`
	IoDraftId   *int                 `db:"name=io_draft_id"`
}

type Flight struct {
	Id               int          `db:"auto"`
	InsertionOrderId int          `db:"name=insertion_order_id"`
	ProductionId     int          `db:"name=production_id"`
	Status           FlightStatus `db:"name=status"`
	AdType           string       `db:"name=ads_type"`
	Placement        string       `db:"name=placement"`
	Length           string       `db:"name=length"`
	TotalCost        float64      `db:"name=total_cost"`
	Cpm              float64      `db:"name=cpm"`
	Impressions      int          `db:"name=impressions"`
	PromoCode        string       `db:"name=promo_code"`
	Identifier       string       `db:"name=identifier"`
	Advertiser       string       `db:"name=advertiser"`
	Media            string       `db:"name=media"`
	CreatedAt        time.Time    `db:"name=created_at auto"`
	UpdatedAt        time.Time    `db:"name=updated_at auto"`
	DeletedAt        *time.Time   `db:"name=deleted_at auto"`
	IoFlightDraftId  *int         `db:"name=io_flight_draft_id"`
	ChangeBy         *string      `db:"name=change_by"`
}

type InsertionOrderListFilter struct {
	Search      *string
	Status      *[]string
	Payers      *[]int
	Productions *[]int
	Sorts       []struct{ Field, Direction string }
	From        *string
	To          *string
	Page        *int
	Size        *int
}

func (f InsertionOrderListFilter) GetSorts() []struct{ Field, Direction string } {
	_sorts := f.Sorts
	_sorts = append(_sorts, struct{ Field, Direction string }{"id", "desc"})
	return _sorts
}

type InsertionOrderListItem struct {
	Id          int                  `json:"id"`
	Number      string               `json:"insertion_order"`
	SignedDate  *string              `json:"signed_date"`
	Advertisers []*string            `json:"advertisers"`
	Medias      []string             `json:"medias"`
	PayerName   string               `json:"payer"`
	Impressions string               `json:"impressions"`
	Cost        float64              `json:"cost"`
	Status      InsertionOrderStatus `json:"status"`
} //@name InsertionOrder

type FlightListFilter struct {
	Status      *[]string
	Advertisers *[]string
	Payers      *[]int
	Productions *[]int
	Sorts       []struct{ Field, Direction string }
	From        *string
	To          *string
	Page        *int
	Size        *int
}

func (f FlightListFilter) GetSorts() []struct{ Field, Direction string } {
	_sorts := f.Sorts
	_sorts = append(_sorts, struct{ Field, Direction string }{"id", "desc"})
	return _sorts
}

type FlightListItem struct {
	Id             int          `json:"id"`
	Identifier     string       `json:"identifier"`
	InsertionOrder string       `json:"insertion_order"`
	Production     string       `json:"production"`
	Advertiser     *string      `json:"advertiser"`
	Media          string       `json:"media"`
	Payer          string       `json:"payer"`
	Cost           float64      `json:"cost"`
	Impressions    int          `json:"impressions"`
	DropDates      []string     `json:"drop_dates"`
	Status         FlightStatus `json:"status"`
} //@name Flight

type DraftFlightListItem struct {
	Id              int      `json:"id"`
	Identifier      string   `json:"identifier"`
	ProductionId    *int     `json:"production_id"`
	Length          *string  `json:"length"`
	TotalCost       *float64 `json:"total_cost"`
	DropDates       *string  `json:"drop_dates"`
	Production      *string  `json:"production_suggested"`
	PromoCode       *string  `json:"promo_code"`
	AdsType         *string  `json:"ads_type"`
	Placement       *string  `json:"placement"`
	Media           *string  `json:"media"`
	Host            *string  `json:"host"`
	LivePrerecorded *string  `json:"live_prerecorded"`
	Spots           *int     `json:"spots"`
	Cpm             *float64 `json:"cpm"`
	Impressions     *int     `json:"impressions"`
	Advertiser      *string  `json:"advertiser"`
} //@name DraftFlight

type IoDraft struct {
	Id                int           `db:"auto"`
	Filename          string        `db:"name=file_name"`
	Filepath          string        `db:"name=file_path"`
	Status            IoDraftStatus `db:"name=status"`
	ChangeBy          *string       `db:"name=change_by"`
	Number            *string       `db:"name=io_number auto"`
	PayerId           *int          `db:"name=io_payer_id auto"`
	Payer             *string       `db:"name=payer auto"`
	NetCost           *float64      `db:"name=io_net_total_io_cost auto"`
	NetCostCurrency   *string       `db:"name=io_net_total_io_cost_currency auto"`
	Impressions       *int          `db:"name=io_total_io_impressions auto"`
	GrossCost         *float64      `db:"name=io_gross_total_io_cost auto"`
	GrossCostCurrency *string       `db:"name=io_gross_total_io_cost_currency auto"`
	SignedDate        *string       `db:"name=signed_at auto"`
	Creator           *string       `db:"name=creator auto"`
	CreatedAt         time.Time     `db:"name=created_at auto"`
	UpdatedAt         time.Time     `db:"name=updated_at auto"`
	DeletedAt         *time.Time    `db:"name=deleted_at auto"`
	Advertiser        *string       `db:"name=advertiser auto"`
}

type IoDraftFlight struct {
	Id                int        `db:"auto"`
	IoDraft           int        `db:"name=io_draft_id"`
	ProductionId      *int       `db:"name=production_id"`
	Production        string     `db:"name=production"`
	AdsType           string     `db:"name=ads_type"`
	Placement         string     `db:"name=placement"`
	Length            string     `db:"name=length"`
	TotalCost         float64    `db:"name=total_cost"`
	TotalCostCurrency string     `db:"name=total_cost_currency"`
	Cpm               float64    `db:"name=cpm"`
	CpmCurrency       string     `db:"name=cpm_currency"`
	Impressions       int        `db:"name=impressions"`
	PromoCode         string     `db:"name=promo_code"`
	Identifier        string     `db:"name=identifier"`
	Media             string     `db:"name=media"`
	LivePrerecorded   string     `db:"name=live_prerecorded"`
	Host              string     `db:"name=host"`
	Advertiser        *string    `db:"name=advertiser"`
	Spots             *int       `db:"name=spots"`
	CreatedAt         time.Time  `db:"name=created_at auto"`
	UpdatedAt         time.Time  `db:"name=updated_at auto"`
	DeletedAt         *time.Time `db:"name=deleted_at auto"`
	Dates             string     `db:"name=flight_dates"`
	ChangeBy          *string    `db:"name=change_by"`
}

type DropDate string //@name DropDate

func (d *DropDate) Range() (string, string, string) {
	values := strings.Split(string(*d), "+")
	if len(values) > 1 {
		return values[0], values[1], "range"
	}
	return values[0], values[0], "date"
}

type IoDraftFlightDate struct {
	Id              int        `json:"id"`
	StartDate       time.Time  `json:"start_date"`
	EndDate         *time.Time `json:"end_date"`
	IoDraftFlightId int        `json:"io_draft_flight_id"`
}

type FlightDate struct {
	Id        int        `json:"id" db:"name=id"`
	StartDate time.Time  `json:"start_date" db:"name=init_date"`
	EndDate   *time.Time `json:"end_date" db:"name=end_date"`
	FlightId  int        `json:"flight_id" db:"name=flight_id"`
	ValueType string     `json:"value_type" db:"name=value_type"`
}

type IoDraftListItem struct {
	Id       int           `json:"id"`
	Filename string        `json:"file_name"`
	Filepath string        `json:"-"`
	Status   IoDraftStatus `json:"status"`
} //@name IoDraft

type IoDraftListFilter struct {
	Status *[]string
	Sorts  []struct{ Field, Direction string }
	Page   *int
	Size   *int
}

func (f IoDraftListFilter) GetSorts() []struct{ Field, Direction string } {
	_sorts := f.Sorts
	_sorts = append(_sorts, struct{ Field, Direction string }{"id", "desc"})
	return _sorts
}

type ProcessingStatus struct {
	Total     int `json:"total"`
	Processed int `json:"processed"`
} //@name ProcessingStatus

type IoDraftExtractedData struct {
	Number            *string  `json:"io_number"`
	PayerId           *int     `json:"payer_id"`
	NetCost           *float64 `json:"net_total_io_cost"`
	Impressions       *int     `json:"total_io_impressions"`
	GrossCost         *float64 `json:"gross_total_io_cost"`
	Payer             *string  `json:"payer_suggested"`
	NetCostCurrency   *string  `json:"net_total_io_cost_currency"`
	GrossCostCurrency *string  `json:"gross_total_io_cost_currency"`
	SignedDate        *string  `json:"signed_at"`
	Advertiser        *string  `json:"advertiser"`
}

type IoDraftDetails struct {
	Id            int                   `json:"id"`
	Filepath      string                `json:"file"`
	Status        IoDraftStatus         `json:"status"`
	ExtractedData IoDraftExtractedData  `json:"extracted_data"`
	Flights       []DraftFlightListItem `json:"flights"`
} //@name IoDraftDetails

// / Auditable
func (d IoDraft) Track() bool {
	return true
}

func (d InsertionOrder) Track() bool {
	return true
}

func (d Flight) Track() bool {
	return true
}

type BookingStats struct {
	TotalInsertionOrders    *float32 `json:"total_insertion_orders"`
	BookingFulfillmentRate  *float32 `json:"booking_fulfillment_rate"`
	CustomerConcentration   *float32 `json:"customer_concentration"`
	ProductionConcentration *float32 `json:"production_concentration"`
} //@name BookingStats

type OrderWithFlights struct {
	Id      int
	Flights []int
} //@name OrderWithFlights

type BookingKpiDetailsItem struct {
	Grouping string  `json:"label" db:"name=grouping"`
	Value    float64 `json:"value" db:"name=total"`
} //@name BookingValueItem

type DraftToProcess struct {
	Id       int    `db:"name=id"`
	Filepath string `db:"name=file_path"`
}

type ReviewedFlightInput struct {
	DraftId      *int     `json:"id"`
	ProductionId int      `json:"production_id"`
	Length       string   `json:"length"`
	TotalCost    float64  `json:"total_cost"`
	Cpm          float64  `json:"cpm"`
	Advertiser   string   `json:"advertiser"`
	AdsType      string   `json:"ads_type"`
	Placement    string   `json:"placement"`
	Media        string   `json:"media"`
	Impressions  int      `json:"impressions"`
	PromoCode    string   `json:"promo_code"`
	DropDates    []string `json:"drop_dates"`
} //@name ReviewedFlightInput

type ReviewedDraftInput struct {
	DraftId     int                   `uri:"id" binding:"required" swaggerignore:"true"`
	PayerId     int                   `json:"payer_id"`
	NetCost     float64               `json:"net_total_io_cost"`
	Impressions int                   `json:"total_io_impressions"`
	GrossCost   float64               `json:"gross_total_io_cost"`
	SignedDate  string                `json:"signed_at"`
	Flights     []ReviewedFlightInput `json:"flights"`
} //@name ReviewedDraftInput

func (d *ReviewedDraftInput) Validate() error {

	if d.PayerId < 1 {
		return ErrPayerIdFieldIsRequired
	}
	if len(d.Flights) == 0 {
		return ErrFlightsAreRequired
	}
	for _, f := range d.Flights {
		if err := f.Validate(); err != nil {
			return err
		}
	}
	return nil
}

func (fd *ReviewedFlightInput) Validate() error {
	if fd.ProductionId < 1 {
		return ErrProductionIdFieldIsRequired
	}

	return nil
}
