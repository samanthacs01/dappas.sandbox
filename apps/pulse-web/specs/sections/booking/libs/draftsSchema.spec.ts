import { z } from 'zod';
import { draftDetailsSchema, draftExtractedData, draftFlights } from './../../../../src/modules/admin/booking/utils/draftReviewSchema';


describe('draftFlights', () => {
  it('should validate correct input', () => {
    const validInput = [
      {
        id: 1,
        production_id: 123,
        advertiser: 'Test Advertiser',
        media: 'TV',
        ads_type: 'Commercial',
        placement: 'Prime Time',
        length: '30s',
        cpm: 10,
        total_cost: 1000,
        drop_dates: new Date(),
        impressions: 100000,
        promo_code: 'PROMO123',
      },
    ];

    expect(() => draftFlights.parse(validInput)).not.toThrow();
  });

  it('should throw an error if production_id is missing or invalid', () => {
    const invalidInput = [
      {
        id: 1,
        advertiser: 'Test Advertiser',
        media: 'TV',
        ads_type: 'Commercial',
        placement: 'Prime Time',
        length: '30s',
        cpm: 10,
        total_cost: 1000,
        drop_dates: new Date(),
        impressions: 100000,
        promo_code: 'PROMO123',
      },
    ];

    expect(() => draftFlights.parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if advertiser is missing', () => {
    const invalidInput = [
      {
        id: 1,
        production_id: 123,
        media: 'TV',
        ads_type: 'Commercial',
        placement: 'Prime Time',
        length: '30s',
        cpm: 10,
        total_cost: 1000,
        drop_dates: new Date(),
        impressions: 100000,
        promo_code: 'PROMO123',
      },
    ];

    expect(() => draftFlights.parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should handle DateRange for drop_dates', () => {
    const validInput = [
      {
        id: 1,
        production_id: 123,
        advertiser: 'Test Advertiser',
        media: 'TV',
        ads_type: 'Commercial',
        placement: 'Prime Time',
        length: '30s',
        cpm: 10,
        total_cost: 1000,
        drop_dates: { from: new Date(), to: new Date() },
        impressions: 100000,
        promo_code: 'PROMO123',
      },
    ];

    expect(() => draftFlights.parse(validInput)).not.toThrow();
  });
});

describe('draftExtractedData', () => {
  it('should validate correct input', () => {
    const validInput = {
      payer_id: 1,
      net_total_io_cost: 1000,
      total_io_impressions: 100000,
      gross_total_io_cost: 1200,
      signed_at: new Date(),
    };

    expect(() => draftExtractedData.parse(validInput)).not.toThrow();
  });

  it('should throw an error if payer_id is missing', () => {
    const invalidInput = {
      net_total_io_cost: 1000,
      total_io_impressions: 100000,
      gross_total_io_cost: 1200,
      signed_at: new Date(),
    };

    expect(() => draftExtractedData.parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if net_total_io_cost is missing', () => {
    const invalidInput = {
      payer_id: 1,
      total_io_impressions: 100000,
      gross_total_io_cost: 1200,
      signed_at: new Date(),
    };

    expect(() => draftExtractedData.parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should handle optional fields', () => {
    const validInput = {
      payer_id: 1,
      net_total_io_cost: 1000,
    };

    expect(() => draftExtractedData.parse(validInput)).not.toThrow();
  });
});

describe('draftDetailsSchema', () => {
  it('should validate correct input', () => {
    const validInput = {
      file: 'test.pdf',
      extracted_data: {
        payer_id: 1,
        net_total_io_cost: 1000,
      },
      flights: [
        {
          id: 1,
          production_id: 123,
          advertiser: 'Test Advertiser',
          media: 'TV',
          ads_type: 'Commercial',
          placement: 'Prime Time',
          length: '30s',
          cpm: 10,
          total_cost: 1000,
          drop_dates: new Date(),
          impressions: 100000,
          promo_code: 'PROMO123',
        },
      ],
    };

    expect(() => draftDetailsSchema().parse(validInput)).not.toThrow();
  });

  it('should throw an error if file is missing', () => {
    const invalidInput = {
      extracted_data: {
        payer_id: 1,
        net_total_io_cost: 1000,
      },
      flights: [
        {
          id: 1,
          production_id: 123,
          advertiser: 'Test Advertiser',
          media: 'TV',
          ads_type: 'Commercial',
          placement: 'Prime Time',
          length: '30s',
          cpm: 10,
          total_cost: 1000,
          drop_dates: new Date(),
          impressions: 100000,
          promo_code: 'PROMO123',
        },
      ],
    };

    expect(() => draftDetailsSchema().parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if extracted_data is missing', () => {
    const invalidInput = {
      file: 'test.pdf',
      flights: [
        {
          id: 1,
          production_id: 123,
          advertiser: 'Test Advertiser',
          media: 'TV',
          ads_type: 'Commercial',
          placement: 'Prime Time',
          length: '30s',
          cpm: 10,
          total_cost: 1000,
          drop_dates: new Date(),
          impressions: 100000,
          promo_code: 'PROMO123',
        },
      ],
    };

    expect(() => draftDetailsSchema().parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if flights is missing', () => {
    const invalidInput = {
      file: 'test.pdf',
      extracted_data: {
        payer_id: 1,
        net_total_io_cost: 1000,
      },
    };

    expect(() => draftDetailsSchema().parse(invalidInput)).toThrow(z.ZodError);
  });
});
