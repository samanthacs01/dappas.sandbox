import { MultipleChart } from '@/server/types/chart';
import { DollarSign, Percent } from 'lucide-react';

export const OverviewBookingChartsConfig = (): MultipleChart[] => {
  return [
    {
      chartType: 'bar',
      data: [
        { name: 'Payer. A', value: 120 },
        { name: 'Payer. B', value: 95 },
        { name: 'Payer. C', value: 150 },
        { name: 'Payer. D', value: 110 },
        { name: 'Payer. E', value: 130 },
        { name: 'Payer. F', value: 85 },
        { name: 'Payer. G', value: 140 },
        { name: 'Payer. H', value: 100 },
        { name: 'Payer. I', value: 115 },
        { name: 'Payer. J', value: 125 },
      ],
      value: 1170,
      valueFormat: 'currency',
      title: 'Booking values',
      subtitle: 'Value/Payer',
      expandible: true,
      icon: <DollarSign width={16} height={16} />,
    },
    {
      chartType: 'pastel',
      data: [
        { name: 'Not invoiced orders', value: 40 },
        { name: 'Executed orders', value: 60 },
      ],
      value: 60,
      valueFormat: 'percentage',
      title: 'Booking fulfillment rate',
      icon: <Percent width={16} height={16} />,
      expandible: true,
      config: {
        legend: false,
        valueFormat: 'percentage',
      },
    },
    {
      chartType: 'pastel',
      data: [
        { name: 'Payer. A', value: 60 },
        { name: 'Payer. B', value: 45 },
        { name: 'Payer. C', value: 70 },
        { name: 'Payer. D', value: 55 },
        { name: 'Payer. E', value: 50 },
        { name: 'Others', value: 65 },
      ],
      value: 88,
      valueFormat: 'percentage',
      title: 'Customer Concentration',
      icon: <Percent width={16} height={16} />,
      expandible: true,
      config: {
        legend: false,
        valueFormat: 'percentage',
      },
    },
    {
      chartType: 'pastel',
      data: [
        { name: 'Payer. A', value: 28.6 },
        { name: 'Payer. B', value: 21.4 },
        { name: 'Payer. C', value: 19 },
        { name: 'Payer. D', value: 16.7 },
        { name: 'Payer. E', value: 9.5 },
        { name: 'Others', value: 4.8 },
      ],
      value: 95.2,
      valueFormat: 'percentage',
      title: 'Production Concentration',
      icon: <Percent width={16} height={16} />,
      expandTitle: 'Revenue',
      expandible: true,
      config: {
        legend: false,
        valueFormat: 'percentage',
      },
    },
  ];
};
