import { DraftFlights, DraftFlightsReviewed } from '@/server/types/booking';
import { ReceivedChart } from '@/server/types/chart';
import { format } from 'date-fns';

export const parseToChartType = (data: ReceivedChart[]) =>
  data.map(({ label, value, grouping_details, composed_value }) => ({
    name: grouping_details ?? label,
    value,
    details: grouping_details,
    composed_value: composed_value ? composed_value : undefined,
  }));

export const standardizeDropDates = (
  flight: DraftFlights,
): DraftFlightsReviewed => {
  try {
    const { drop_dates, ...rest } = flight;

    let standardizedDropDates: string[] = [];

    if (Array.isArray(drop_dates)) {
      standardizedDropDates = drop_dates.map((date) =>
        format(date, 'yyyy-MM-dd'),
      );
    } else if (
      typeof drop_dates === 'object' &&
      'from' in drop_dates &&
      'to' in drop_dates
    ) {
      standardizedDropDates = [
        `${format(drop_dates.from as string, 'yyyy-MM-dd')} + ${format(drop_dates.to as string, 'yyyy-MM-dd')}`,
      ];
    }

    return {
      ...rest,
      drop_dates: standardizedDropDates,
    };
  } catch {
    return {
      ...flight,
      drop_dates: [],
    };
  }
};
