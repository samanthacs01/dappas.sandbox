import { PayableProductionDto } from '@/server/types/payable';
import { ProductionDashboardSummary } from '@/server/types/production';

export const productionDashboardSummary: ProductionDashboardSummary = {
  total_outstanding_receivables: 9900,
  total_currently_advanced: 4575,
  total_available_to_advance: 3900,
  estimated_cost: 113.33,
  time_to_fund: 24,
};

export const getRandomPayableProductionDto = (): PayableProductionDto => {
  return {
    id: Math.floor(Math.random() * 1000) + 1,
    entity_name: 'Test Entity',
    entity_address: '123 Main St',
    contact_name: 'John Doe',
    contact_phone_number: '+15551234567',
    contact_email: 'john.doe@example.com',
    production_split: 0.5,
    production_billing_type: 'billing',
    net_payment_terms: 30,
    production_expense_recoupment_type: 'after',
    contract_file: new File([''], 'mock.pdf'),
  };
};
