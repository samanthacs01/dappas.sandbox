package workers

import (
	"context"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"

	"go.uber.org/zap"
	"selector.dev/documents"
	"selector.dev/pulse/config"
	domain "selector.dev/pulse/internal/domain/booking"
	"selector.dev/pulse/internal/domain/payables"
	"selector.dev/pulse/internal/domain/receivables"
	"selector.dev/pulse/internal/domain/shared"
	"selector.dev/pulse/internal/domain/shared/services"
	"selector.dev/utils"
)

const (
	MimeType = "application/pdf"
	BasePath = "/app/bucket/upload"
)

type processDraftResult struct {
	err   error
	draft domain.DraftToProcess
	items []documents.Item
}

type processResult struct {
	err   error
	draft *domain.IoDraft
}

type documentProcessorWorker struct {
	config               config.WorkerConfig
	logger               *zap.Logger
	repository           domain.IBookingRepository
	productionRepository payables.IProductionsRepository
	payerRepository      receivables.IPayersRepository
	client               documents.IProcessor
}

func NewDocumentProcessorWorker(r domain.IBookingRepository, pr payables.IProductionsRepository, yr receivables.IPayersRepository, cfg config.WorkerConfig, l *zap.Logger) services.IDocumentProcessor {
	return &documentProcessorWorker{
		repository:           r,
		config:               cfg,
		logger:               l,
		productionRepository: pr,
		payerRepository:      yr,
	}
}

func (w *documentProcessorWorker) Run(ctx context.Context) (*int, error) {
	client, err := documents.NewDocumentAiProcessor(w.config.GetProcessorID(), w.config.GetProcessorVersion(), w.config.GetProjectNumber(), w.config.GetProcessorLocation(), ctx)
	if err != nil {
		w.logger.Error("Failed to create document processor client", zap.Error(err))
		return nil, err
	}

	results := make(chan processResult)
	var wg sync.WaitGroup
	defer client.Close()
	w.client = client
	w.logger.Info("Starting document processor worker")
	go func() {
		wg.Wait()
		close(results)
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		w.logger.Info("Processing documents")
		w.process(ctx, results, 10)
	}()

	var draftsProcessed []int
	for result := range results {
		if result.err != nil {
			w.logger.Error(result.err.Error(), zap.Error(result.err))
			if result.draft == nil {
				if result.err == ErrNoDraftsToProcess {
					zero := 0
					return &zero, nil
				}
				return nil, result.err
			}
			err := w.repository.UpdateDraftStatus(result.draft.Id, domain.IoDraftStatusFailed)
			if err != nil {
				w.logger.Error("failed to update draft status", zap.Error(err))
			}
			draftsProcessed = append(draftsProcessed, result.draft.Id)
			continue
		}
		d := *result.draft
		if err := w.repository.UpdateDraftStatus(d.Id, domain.IoDraftStatusPendingToReview); err != nil {
			w.logger.Error("failed to update draft status to ", zap.Any("status", domain.IoDraftStatusPendingToReview), zap.Error(err))
		}
		draftsProcessed = append(draftsProcessed, d.Id)
	}
	w.logger.Info("Processed drafts", zap.Ints("drafts", draftsProcessed))
	amount := len(draftsProcessed)
	return &amount, nil
}

func (w *documentProcessorWorker) process(ctx context.Context, results chan processResult, batch int) {
	if batch == 0 {
		batch = 10
	}
	drafts, err := w.repository.GetIoDraftToProcess(batch)
	if err != nil {
		results <- processResult{err: err}
		return
	}
	if drafts == nil || len(*drafts) == 0 {
		results <- processResult{err: ErrNoDraftsToProcess}
		return
	}

	ids := utils.Map(*drafts, func(d domain.DraftToProcess) int {
		return d.Id
	})

	if err := w.repository.UpdateBatchDraftStatus(ids, domain.IoDraftStatusExtractingInfo); err != nil {
		results <- processResult{err: err}
		return
	}
	payers, err := w.payerRepository.FindAllPayersAsNomenclator()
	if err != nil {
		results <- processResult{err: err}
		return
	}
	productions, err := w.productionRepository.FindAllProductionsAsNomenclator()
	if err != nil {
		results <- processResult{err: err}
		return
	}
	var fieldMapping = getEnvironmentMapper(w.config.GetProcessorEnv())

	processDraft := make(chan processDraftResult, len(*drafts))

	go func() {
		var wg sync.WaitGroup
		for _, draft := range *drafts {
			wg.Add(1)
			go func(d domain.DraftToProcess) {
				defer wg.Done()
				w.processDraft(ctx, d, processDraft)
			}(draft)
		}
		wg.Wait()
		close(processDraft)
	}()

	for pd := range processDraft {
		if pd.err != nil {
			results <- processResult{err: pd.err, draft: &domain.IoDraft{Id: pd.draft.Id}}
			continue
		}
		draft, flights := parseEntities(pd.draft, pd.items, fieldMapping, payers, productions)
		if err := w.repository.UpdateDraftAfterProcessed(draft, flights); err != nil {
			results <- processResult{err: err, draft: &draft}
			continue
		}
		results <- processResult{err: nil, draft: &draft}
	}
}
func (w *documentProcessorWorker) processDraft(ctx context.Context, d domain.DraftToProcess, results chan processDraftResult) {
	if d.Filepath == "" {
		err := errors.New("draft IO has no file path")
		results <- processDraftResult{err: err, draft: d}
		return
	}

	w.logger.Info("Processing draft", zap.String("file", d.Filepath))
	separator := string(filepath.Separator)
	if d.Filepath[0] == '/' {
		separator = ""
	}

	fileRealPath := fmt.Sprintf("%s%s%s", BasePath, separator, d.Filepath)

	w.logger.Info("Downloading file", zap.String("fileRealPath", fileRealPath))

	data, err := os.ReadFile(fileRealPath)
	if err != nil {
		results <- processDraftResult{err: err, draft: d}
		return
	}

	if len(data) == 0 {
		err := errors.New("file content is empty")
		results <- processDraftResult{err: err, draft: d}
		return
	}

	items, err := w.retry(func() (interface{}, error) {
		return w.client.Parse(ctx, MimeType, data)
	}, 3)

	if err != nil {
		results <- processDraftResult{err: err, draft: d}
		return
	}

	entities, ok := items.([]documents.Item)
	if !ok {
		err := errors.New("failed to parse document")
		results <- processDraftResult{err: err, draft: d}
		return
	}
	if len(entities) == 0 {
		err := errors.New("no entities found in document")
		results <- processDraftResult{err: err, draft: d}
		return
	}
	results <- processDraftResult{err: nil, draft: d, items: entities}
}
func parseEntities(
	d domain.DraftToProcess,
	items []documents.Item,
	fieldMapping map[string]string,
	payers *[]shared.Nomenclator,
	productions *[]shared.Nomenclator) (domain.IoDraft, []domain.IoDraftFlight) {
	var draft = domain.IoDraft{Id: d.Id}
	var rawFlights [][]documents.Item

	for _, it := range items {
		processEntity(it, &draft, fieldMapping, payers, &rawFlights)
	}

	flights := processRawFlights(rawFlights, draft.Id, productions, fieldMapping, draft.Advertiser)
	return draft, flights
}

func processEntity(
	it documents.Item,
	draft *domain.IoDraft,
	fieldMapping map[string]string,
	payers *[]shared.Nomenclator,
	rawFlights *[][]documents.Item) {
	key := it.Key
	entity := it.Value
	fmt.Println("PARSE Entity", key, entity)
	switch key {
	case fieldMapping[Flights]:
		*rawFlights = append(*rawFlights, entity.([]documents.Item))
	case fieldMapping[Advertiser]:
		if draft.Advertiser == nil || len(*draft.Advertiser) == 0 {
			strVal := entity.(string)
			draft.Advertiser = &strVal
		}
	case fieldMapping[Creator]:
		strVal := entity.(string)
		draft.Creator = &strVal
	case fieldMapping[Signed_Date]:
		strVal := dateToString(entity)
		draft.SignedDate = &strVal
	case fieldMapping[Total_Impressions]:
		amount := stringToInt(entity)
		draft.Impressions = &amount
	case fieldMapping[Gross_Total_Cost]:
		amount, currency := moneyToFloat(entity)
		draft.GrossCost = &amount
		draft.GrossCostCurrency = &currency
	case fieldMapping[Net_Total_Cost]:
		amount, currency := moneyToFloat(entity)
		draft.NetCost = &amount
		draft.NetCostCurrency = &currency
	case fieldMapping[Payer]:
		processPayer(entity, draft, payers)
	}
}

func processPayer(
	entity interface{},
	draft *domain.IoDraft,
	payers *[]shared.Nomenclator) {
	strVal := entity.(string)
	for _, p := range *payers {
		if strings.EqualFold(p.Text, strVal) {
			id, err := strconv.Atoi(p.Id)
			if err != nil {
				fmt.Println("failed to convert payer id", err)
				continue
			}
			draft.PayerId = &id
			break
		}
	}
	draft.Payer = &strVal
}

func processRawFlights(
	rawFlights [][]documents.Item,
	ioDraftId int,
	productions *[]shared.Nomenclator,
	fieldMapping map[string]string,
	advertiser *string) []domain.IoDraftFlight {
	var flights []domain.IoDraftFlight
	if advertiser != nil && len(*advertiser) > 0 {
		for _, items := range rawFlights {
			flight := parseFlights(items, ioDraftId, productions, fieldMapping)
			flight.Advertiser = advertiser
			flights = append(flights, flight)
		}
	}
	return flights
}

func parseFlights(properties []documents.Item, ioDraftId int, productions *[]shared.Nomenclator, fieldMapping map[string]string) domain.IoDraftFlight {
	flight := domain.IoDraftFlight{
		IoDraft: ioDraftId,
	}
	for _, it := range properties {
		processFlightProperty(it, &flight, productions, fieldMapping)
	}
	return flight
}

func processFlightProperty(
	it documents.Item,
	flight *domain.IoDraftFlight,
	productions *[]shared.Nomenclator,
	fieldMapping map[string]string,
) {
	key := it.Key
	value := it.Value
	fmt.Println("Property", key, value)
	switch key {
	case fieldMapping[Flight_CPM]:
		amount, currency := moneyToFloat(value)
		flight.Cpm = amount
		flight.CpmCurrency = currency
	case fieldMapping[Flight_NetCost]:
		amount, currency := moneyToFloat(value)
		flight.TotalCost = amount
		flight.TotalCostCurrency = currency
	case fieldMapping[Flight_Impressions]:
		flight.Impressions = stringToInt(value)
	case fieldMapping[Flight_AdType]:
		flight.AdsType = value.(string)
	case fieldMapping[Flight_Promo_Code]:
		flight.PromoCode = value.(string)
	case fieldMapping[Flight_Length]:
		flight.Length = value.(string)
	case fieldMapping[Flight_Placement]:
		flight.Placement = value.(string)
	case fieldMapping[Flight_Media]:
		flight.Media = value.(string)
	case fieldMapping[Flight_Host]:
		flight.Host = value.(string)
	case fieldMapping[Flight_Live_Prerecorded]:
		flight.LivePrerecorded = value.(string)
	case fieldMapping[Flight_Spots]:
		amount := stringToInt(value)
		flight.Spots = &amount
	case fieldMapping[Flight_Dates]:
		flight.Dates = dateToString(value)
	case fieldMapping[Flight_Productions]:
		processFlightProduction(value, flight, productions)
	}
}

func processFlightProduction(
	value interface{},
	flight *domain.IoDraftFlight,
	productions *[]shared.Nomenclator,
) {
	if productions == nil {
		fmt.Println("Productions not found")
		return
	}
	production := value.(string)
	for _, p := range *productions {
		if strings.Compare(strings.ToLower(p.Text), strings.ToLower(production)) == 0 {
			id, err := strconv.Atoi(p.Id)
			if err != nil {
				fmt.Println("Failed to convert payer id", err)
				continue
			}
			flight.ProductionId = &id
			break
		}
	}
	flight.Production = production
}

func moneyToFloat(value interface{}) (float64, string) {
	if money, ok := value.(map[string]interface{}); ok {
		amount := money["amount"].(float64)
		currency := money["currency"].(string)
		return amount, currency
	} else {
		amount := stringToFloat(value.(string))
		currency := "USD"
		return amount, currency
	}
}

func stringToInt(value interface{}) int {
	var text string
	if money, ok := value.(map[string]interface{}); ok {
		text = money["text"].(string)
	} else {
		text = value.(string)
	}

	result, err := strconv.Atoi(strings.Replace(text, ",", "", -1))
	if err != nil {
		fmt.Println("Error converting string to int", err)
		return 0
	}
	return result
}

func stringToFloat(value string) float64 {
	result, err := strconv.ParseFloat(strings.Replace(strings.Replace(value, ",", "", -1), "$", "", -1), 64)
	if err != nil {
		fmt.Println("Error converting string to float", err)
		return 0
	}
	return result
}

func dateToString(value interface{}) string {
	if date, ok := value.(map[string]interface{}); ok {
		return fmt.Sprintf("%v-%v-%v", date["month"], date["day"], date["year"])
	} else {
		return value.(string)
	}
}

func (w *documentProcessorWorker) retry(operation func() (interface{}, error), attempts int) (interface{}, error) {
	var result interface{}
	var err error
	for i := 0; i < attempts; i++ {
		result, err = operation()
		if err == nil {
			return result, nil
		}
		sleepDuration := 2 * (i + 1)
		time.Sleep(time.Duration(sleepDuration) * time.Second)
		w.logger.Warn("Retrying operation", zap.Int("attempt", i+1), zap.Error(err))
	}
	return nil, err
}
