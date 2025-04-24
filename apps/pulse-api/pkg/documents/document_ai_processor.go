package documents

import (
	"context"
	"fmt"

	documentai "cloud.google.com/go/documentai/apiv1"
	"cloud.google.com/go/documentai/apiv1/documentaipb"
	"google.golang.org/api/option"
)

type documentAiProcessor struct {
	processorId string
	processorVersion string
	projectNumber string
	location string
	client *documentai.DocumentProcessorClient
}

func NewDocumentAiProcessor(processorId, processorVersion, projectNumber, location string, ctx context.Context) (IProcessor, error) {
	endpoint := fmt.Sprintf("%s-documentai.googleapis.com:443", location)
	client, err := documentai.NewDocumentProcessorClient(ctx, option.WithEndpoint(endpoint))
	if err != nil {
		return nil, err
	}
	processor:= &documentAiProcessor{
		processorId: processorId,
		processorVersion: processorVersion,
		projectNumber: projectNumber,
		location: location,
		client: client,
	}
	return processor, nil
}

func (d *documentAiProcessor) Parse(ctx context.Context, mimeType string, data []byte) ([]Item, error) {
	req := d.buildRequest(mimeType, data)
	resp, err := d.client.ProcessDocument(ctx, &req)
	if err != nil {
		return nil, err
	}
	document := resp.GetDocument()
	
	result := d.parseEntities(document.GetEntities())
	return result, nil
}

func (d *documentAiProcessor) Close() {
	d.client.Close()
}

func (d *documentAiProcessor) buildRequest(mimeType string, data []byte) documentaipb.ProcessRequest {
	name := fmt.Sprintf("projects/%s/locations/%s/processors/%s/versions/%s", d.projectNumber, d.location, d.processorId, d.processorVersion)
	if len(d.processorVersion) == 0 {
		name = fmt.Sprintf("projects/%s/locations/%s/processors/%s", d.projectNumber, d.location, d.processorId)
	}
	return documentaipb.ProcessRequest{
		Name: name,
		Source: &documentaipb.ProcessRequest_RawDocument{
			RawDocument: &documentaipb.RawDocument{
				Content:  data,
				MimeType: mimeType,
			},
		},
	}
}

func (d *documentAiProcessor) parseEntities(entities []*documentaipb.Document_Entity) []Item {
	result := make([]Item, 0)
	for _, entity := range entities {
		properties := entity.GetProperties()
		var value interface{}
		if len(properties) > 0 {
			value = d.parseEntities(properties)
		}else if entity.NormalizedValue != nil {
			value = d.convertNormalizedValue(entity.NormalizedValue)
		}else {
			value = entity.MentionText	
		}
		it := Item{
			Key: entity.Type,
			Value: value,
		}
		result = append(result, it)		
	}
	return result
}


func (d *documentAiProcessor) convertNormalizedValue(nv *documentaipb.Document_Entity_NormalizedValue) map[string]interface{} {
    if nv == nil {
        return nil
    }
    result := make(map[string]interface{})
    switch v := nv.GetStructuredValue().(type) {
		case *documentaipb.Document_Entity_NormalizedValue_DateValue:
			result["year"] = v.DateValue.GetYear()
			result["month"] = v.DateValue.GetMonth()
			result["day"] = v.DateValue.GetDay()
		case *documentaipb.Document_Entity_NormalizedValue_MoneyValue:
			result["currency"] = v.MoneyValue.GetCurrencyCode()
			result["amount"] = float64(v.MoneyValue.GetUnits()) + float64(v.MoneyValue.GetNanos())/1e9
		case *documentaipb.Document_Entity_NormalizedValue_AddressValue:
			result["address"] = v.AddressValue.GetAddressLines()
			result["city"] = v.AddressValue.GetLocality()
			result["state"] = v.AddressValue.GetRegionCode()
			result["postal_code"] = v.AddressValue.GetPostalCode()
			result["country"] = v.AddressValue.GetRegionCode()
		case *documentaipb.Document_Entity_NormalizedValue_IntegerValue:
			result["value"] = int(v.IntegerValue)
		case *documentaipb.Document_Entity_NormalizedValue_FloatValue:
			result["value"] = float64(v.FloatValue)
		default:
			fmt.Println("Unknown normalized value type", v)
			result["text"] = nv.GetText()
    }
    return result
}