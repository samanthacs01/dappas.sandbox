package workers

import "fmt"

const (
	Flights                 string = "Flight"
	Number                  string = "IoNumber"
	Payer                   string = "Agency"
	Payer_Email             string = "Agency-Email"
	Gross_Total_Cost        string = "Gross-Total-Cost"
	Net_Total_Cost          string = "Net-Total-Cost"
	Signed_Date             string = "Signed-Date"
	Total_Impressions       string = "Total-Impressions"
	Advertiser              string = "Advertiser"
	Creator                 string = "Creator"
	Flight_Productions      string = "Production-Show"
	Flight_NetCost          string = "Flight-Net-Cost"
	Flight_CPM              string = "CPM"
	Flight_Impressions      string = "Flight-impressions"
	Flight_AdType           string = "Ad-type"
	Flight_Media            string = "Flight-Media"
	Flight_Total_Cost       string = "Flight-Total-Cost"
	Flight_Host             string = "Host"
	Flight_Length           string = "Length"
	Flight_Live_Prerecorded string = "Live-Prerecorded"
	Flight_Placement        string = "Placement"
	Flight_Promo_Code       string = "Promo-Code"
	Flight_Spots            string = "Spots"
	Flight_Dates            string = "Flight-dates"
)

func getEnvironmentMapper(env string) map[string]string {
	if env == "dev" {
		fmt.Println("MAPPING DEV")
		return map[string]string{
			Advertiser:              "Advertiser",
			Signed_Date:             "Signed-Date",
			Creator:                 "Creator",
			Total_Impressions:       "Total-Impressions",
			Net_Total_Cost:          "Net-Total-Cost",
			Gross_Total_Cost:        "Gross-Total-Cost",
			Payer:                   "Agency",
			Flights:                 "Flight",
			Payer_Email:             "Agency-Email",
			Flight_Productions:      "Production-Show",
			Flight_NetCost:          "Flight-Total-Cost",
			Flight_CPM:              "CPM",
			Flight_Impressions:      "Flight-impressions",
			Flight_AdType:           "Ad-type",
			Flight_Media:            "Flight-Media",
			Flight_Total_Cost:       "Flight-Total-Cost",
			Flight_Host:             "Host",
			Flight_Length:           "Length",
			Flight_Live_Prerecorded: "Live-Prerecorded",
			Flight_Placement:        "Placement",
			Flight_Promo_Code:       "Promo-Code",
			Flight_Spots:            "Spots",
			Flight_Dates:            "Flight-dates",
		}
	}
	fmt.Println("MAPPING OTHER")
	return map[string]string{
		Advertiser:              "Advertiser",
		Signed_Date:             "Signed-Date",
		Creator:                 "Network",
		Total_Impressions:       "Total-IO-Impressions",
		Net_Total_Cost:          "Net-Total-IO-Cost",
		Gross_Total_Cost:        "Gross-Total-IO-Cost",
		Payer:                   "Payer",
		Flights:                 "Flight",
		Payer_Email:             "Payer-Email",
		Flight_Productions:      "Production",
		Flight_NetCost:          "Total-Cost",
		Flight_CPM:              "CPM",
		Flight_Impressions:      "Impressions",
		Flight_AdType:           "Ads-type",
		Flight_Media:            "Media",
		Flight_Total_Cost:       "Total-Cost",
		Flight_Host:             "Host",
		Flight_Length:           "Length",
		Flight_Live_Prerecorded: "Live-Prerecorded",
		Flight_Placement:        "Placement",
		Flight_Promo_Code:       "Promo-Code",
		Flight_Spots:            "Spots",
		Flight_Dates:            "Date",
	}
}
