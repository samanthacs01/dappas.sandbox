import { DateRange } from 'react-day-picker';
import { z } from 'zod';

export const draftFlights = z.array(
  z.object({
    id: z.number(),
    production_id: z.number().gt(0, { message: 'Production is required' }),
    advertiser: z.string().refine((advertiser) => !!advertiser),
    media: z.string(),
    ads_type: z.string(),
    placement: z.string(),
    length: z.string(),
    cpm: z.number(),
    total_cost: z.number(),
    drop_dates: z
      .union([
        z.instanceof(Date),
        z.array(z.instanceof(Date)),
        z.custom<DateRange>(),
      ])
      .refine((value) => typeof value !== 'string'),
    impressions: z.number(),
    promo_code: z.string(),
  }),
);

export const draftExtractedData = z.object({
  payer_id: z.number({
    required_error: 'Payer is required',
    invalid_type_error: 'Payer is required',
  }),
  net_total_io_cost: z.number({
    required_error: 'Net Total IO Cost is required',
    invalid_type_error: 'Net Total IO Cost is required',
  }),
  total_io_impressions: z.number().optional().nullable(),
  gross_total_io_cost: z.number().optional().nullable(),
  signed_at: z.date().optional().nullable(),
});

export type DraftExtractedData = z.infer<typeof draftExtractedData>;

export const draftDetailsSchema = () =>
  z.object({
    file: z.string(),
    extracted_data: draftExtractedData,
    flights: draftFlights,
  });
