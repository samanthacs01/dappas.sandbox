import { formatDateOrString } from '@/core/lib/date';
import { SearchParams } from '../../server/types/params';
import { getCurrentMonthDateRange } from './date';

export class QueryParamsURLFactory {
  private readonly query?: SearchParams;
  private readonly baseUrl?: string;

  constructor(baseUrl: string, query?: SearchParams) {
    this.query = query;
    this.baseUrl = baseUrl;
  }

  build() {
    const queryParams = new URLSearchParams();

    const reqQuery: SearchParams = {
      ...JSON.parse(JSON.stringify(this.query ?? {})),
    };
    delete reqQuery.currentModal;
    delete reqQuery.currentTab;
    delete reqQuery.payable_chart;
    delete reqQuery.receivables_chart;
    delete reqQuery.booking_chart;
    delete reqQuery.production_chart;
    delete reqQuery.general_chart;

    Object.entries(reqQuery).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, String(value));
      }
    });

    if (this.baseUrl) {
      const url = new URL(this.baseUrl);
      url.search = queryParams.toString();
      return url.toString();
    }
    return queryParams.toString();
  }
}

export const addFromToUrl = (url: string) => {
  const { from, to } = getCurrentMonthDateRange();
  const urlObj = new URL(`https://localhost${url}`);
  urlObj.searchParams.set('from', formatDateOrString(from));
  urlObj.searchParams.set('to', formatDateOrString(to));
  return urlObj.toString().replace('https://localhost', '');
};
