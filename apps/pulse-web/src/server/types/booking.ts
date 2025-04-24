import { FileWithPath } from 'react-dropzone';

/**
 * Represents the status of an insertion order in the booking dashboard
 */
export type InsertionOrderStatus = 'invoiced' | 'partial_invoiced' | 'pending';

/**
 * Represents a insertion order in the booking dashboard
 */
export type InsertionOrder = {
  id: number;
  insertion_order: string;
  signed_date: string;
  advertisers: string[];
  medias: string[];
  payer: string;
  impressions: string;
  cost: number;
  status: InsertionOrderStatus;
};

/**
 * Represents a draft in the booking dashboard
 */
export type DraftStatus =
  | 'pending_to_review'
  | 'extracting_information'
  | 'reviewed'
  | 'uploaded'
  | 'failed';

/**
 * Represents a draft in the booking dashboard
 */
export type Draft = {
  id: number;
  file_name: string;
  status: DraftStatus;
};

/**
 * Represents a flight draft extracted by AI in the booking dashboard
 */
export type DraftFlights = {
  id: number;
  identifier: string; // we do not use this
  production_id: number;
  production_suggested: string;
  advertiser: string;
  media: string;
  ads_type: string;
  placement: string;
  length: string;
  cpm: number;
  total_cost: number;
  drop_dates: string | object;
  impressions: number;
  promo_code: string;
  host: string; // we do not use this
  live_prerecorded: string; // we do not use this
  spots: string; // we do not use this
};

/**
 * Represents the extracted data by AI from IO Draft in the booking dashboard
 */
export type DraftExtractedData = {
  payer_id: number;
  payer_suggested: string;
  net_total_io_cost: number;
  total_io_impressions: number;
  gross_total_io_cost: number;
  net_total_io_cost_currency: number;
  gross_total_io_cost_currency: number;
  signed_at: string | Date;
};

/**
 * Represents a Draft details to review in the booking dashboard
 */
export type DraftDetails = {
  file: string;
  extracted_data: DraftExtractedData;
  flights: DraftFlights[];
  id: number;
  status: DraftStatus;
};

/**
 * Represents a flight status in the booking dashboard
 */

export type FlightStatus = 'pending' | 'invoiced';

/**
 * Represents a flight in the booking dashboard
 */
export type Flight = {
  id: number;
  identifier: string;
  insertion_order: string;
  production: string;
  advertiser: string;
  media: string;
  payer: string;
  cost: number;
  impressions: number;
  drop_dates: string[];
  status: FlightStatus;
};

export type UploadedDocument = {
  file: FileWithPath;
  preview: string;
  name: string;
  size: number;
};

/**
 * Represents an invoice generated in the booking dashboard
 */
export type Invoice = {
  id: number;
  payer: string;
  amount_to_pay: number;
  payment_terms: number;
  due_date: Date;
};

export type BookingFilesProcessingStatus = {
  processed: number;
  total: number;
};

export type DraftFlightsReviewed = Omit<DraftFlights, 'drop_dates'> & {
  drop_dates: string[];
};

export type ReviewDraftDto = {
  flights: DraftFlights[];
  gross_total_io_cost: number;
  net_total_io_cost: number;
  payer_id: number;
  total_io_impressions: number;
  signed_at: string | Date;
};

export type PendingDraftsAmount = {
  pending_to_review: number;
};

export type BookingStats = {
  booking_fulfillment_rate: number;
  customer_concentration: number;
  production_concentration: number;
  total_insertion_orders: number;
};
