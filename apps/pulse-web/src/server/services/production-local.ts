import { ProductionDashboardSummary } from '../types/production';
import { productionDashboardSummary } from './__mock/production';

export async function getProductionDashboardSummary(): Promise<ProductionDashboardSummary> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return Promise.resolve(productionDashboardSummary);
  } catch (e) {
    console.error(e);
    return {
      estimated_cost: 0,
      time_to_fund: 0,
      total_available_to_advance: 0,
      total_currently_advanced: 0,
      total_outstanding_receivables: 0,
    };
  }
}
