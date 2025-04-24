import { DraftFlights } from '@/server/types/booking';
import { ComboBoxOption } from '@/server/types/combo-box';
import { TabType } from '@/server/types/tabs';

export const bookingTabs: TabType[] = [
  { label: 'Orders', value: 'insertion-orders' },
  { label: 'Drafts', value: 'drafts' },
];

export const draftsStatusFilters: ComboBoxOption[] = [
  { label: 'Pending to Review', value: 'pending_to_review' },
  { label: 'Extracting Information', value: 'extracting_information' },
];

export const IOStatusFilters: ComboBoxOption[] = [
  { label: 'Pending', value: 'pending' },
  { label: 'Invoiced', value: 'invoiced' },
  { label: 'Partial  invoiced', value: 'partial_invoiced' },
];

export const flightsStatusFilters: ComboBoxOption[] = [
  { label: 'Pending', value: 'pending' },
  { label: 'Invoiced', value: 'invoiced' },
];

export const getEmptyFlight = (): DraftFlights => ({
  id: 0,
  production_id: '' as unknown as number,
  advertiser: '',
  media: '',
  ads_type: '',
  placement: '',
  length: '',
  cpm: 0,
  total_cost: 0,
  drop_dates: '',
  impressions: 0,
  promo_code: '',
  host: '',
  identifier: '',
  live_prerecorded: '',
  production_suggested: '',
  spots: '',
});
