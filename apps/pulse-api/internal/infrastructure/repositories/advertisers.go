package repositories

import (
	"go.uber.org/zap"
	"selector.dev/database"
	"selector.dev/database/builders"
	"selector.dev/pulse/internal/domain/booking"
	"selector.dev/pulse/internal/domain/shared"
)

type advertisersRepository struct {
	db     *database.Conn
	logger *zap.Logger
}

func NewAdvertisersRepository(db *database.Conn, logger *zap.Logger) booking.IAdvertisersRepository {
	return &advertisersRepository{
		db:     db,
		logger: logger,
	}
}

// GetItemsAsNomenclator implements booking.IAdvertisersRepository.
func (r *advertisersRepository) GetItemsAsNomenclator() (*[]shared.Nomenclator, error) {
	qb := builders.NewSelectRawQueryBuilder("SELECT DISTINCT md5(advertiser) as id, advertiser FROM flights WHERE advertiser is not null", []interface{}{})
	var items []shared.Nomenclator
	if err := database.Query(r.db, qb, &items); err != nil {
		return nil, err
	}

	return &items, nil
}
