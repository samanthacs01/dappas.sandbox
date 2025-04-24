import ChartStatsDisplayContainer from '@/core/components/common/chart/chart-stats-display';
import { BookingStats } from '@/server/types/booking';
import { ChartStatsDisplay } from '@/server/types/chart';
import { DollarSign, Percent } from 'lucide-react';
import { FC } from 'react';

type Props = {
  stats: BookingStats;
  direction?: 'horizontal' | 'vertical';
};

const BookingStatsOverview: FC<Props> = ({ stats, direction }) => {
  const bookingStats: ChartStatsDisplay[] = [
    {
      title: 'Booking values',
      value: stats.total_insertion_orders,
      valueFormat: 'currency',
      expandible: true,
      icon: <DollarSign width={16} height={16} />,
      chartName: 'booking-values',
    },
    {
      icon: <Percent width={16} height={16} />,
      title: 'Booking fulfillment rate',
      value: stats.booking_fulfillment_rate,
      valueFormat: 'percentage',
      expandible: true,
      chartName: 'fulfillment-rate',
    },
    {
      title: 'Customer concentration',
      icon: <Percent width={16} height={16} />,
      value: stats.customer_concentration,
      valueFormat: 'percentage',
      expandible: true,
      chartName: 'customer-concentration',
    },
    {
      title: 'Production concentration',
      icon: <Percent width={16} height={16} />,
      value: stats.production_concentration,
      valueFormat: 'percentage',
      expandible: true,
      chartName: 'production-concentration',
    },
  ];
  return (
    <ChartStatsDisplayContainer
      stats={bookingStats}
      direction={direction}
      chartNameKey="booking_chart"
    />
  );
};

export default BookingStatsOverview;
