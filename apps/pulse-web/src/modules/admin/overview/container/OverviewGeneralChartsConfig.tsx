import { MultipleChart } from '@/server/types/chart';
import { Calendar, DollarSign, Percent } from 'lucide-react';

export const OverviewGeneralChartsConfig = (): MultipleChart[] => {
  return [
    {
      chartType: 'bar',
      data: [
        { name: '1/1/2024', value: 5000 },
        { name: '1/10/2024', value: 7000 },
        { name: '1/12/2024', value: 6500 },
        { name: '1/15/2024', value: 8000 },
        { name: '1/25/2024', value: 7200 },
      ],
      value: 33700,
      valueFormat: 'currency',
      title: 'Revenue',
      subtitle: 'Revenue/Date',
      expandible: true,
      icon: <DollarSign width={16} height={16} />,
      config: {
        valueFormat: 'currency',
      },
    },
    {
      chartType: 'stackedBar',
      data: [
        {
          name: '12/01/2024',
          paid_to_production: 120,
          profit: 20,
        },
        {
          name: '12/01/2024',
          paid_to_production: 200,
          profit: 150,
        },
        {
          name: '12/01/2024',
          paid_to_production: 140,
          profit: 120,
        },
        {
          name: '12/01/2024',
          paid_to_production: 190,
          profit: 80,
        },
        {
          name: '12/01/2024',
          paid_to_production: 220,
          profit: 50,
        },
      ],
      value: 25,
      valueFormat: 'currency',
      title: 'Gross margin',
      icon: <Percent width={16} height={16} />,
      expandible: true,
      config: {
        legend: false,
        legendValues: [
          { name: 'paid_to_production', color: '#ef4444' },
          { name: 'profit', color: '#3b82f6' },
        ],
        valueFormat: 'currency',
        bars: ['Paid to production', 'Profit'],
      },
    },
    {
      chartType: 'composed',
      data: [
        { name: 'Payer. A', value: 45, composedValue: 38 },
        { name: 'Payer. B', value: 55, composedValue: 38 },
        { name: 'Payer. C', value: 50, composedValue: 38 },
        { name: 'Payer. D', value: 40, composedValue: 38 },
        { name: 'Payer. E', value: 35, composedValue: 38 },
        { name: 'Payer. F', value: 60, composedValue: 38 },
        { name: 'Payer. G', value: 25, composedValue: 38 },
        { name: 'Payer. H', value: 35, composedValue: 38 },
        { name: 'Payer. I', value: 42, composedValue: 38 },
        { name: 'Payer. J', value: 42, composedValue: 38 },
      ],
      value: 42.9,
      valueFormat: 'number',
      title: 'Days sales outstanding',
      icon: <Calendar width={16} height={16} />,
      expandible: true,
      withoutExpandHeader: true,
      config: {
        legend: true,
        legendTitle: 'Days sales outstanding (DSO)',
        legendValues: [
          { name: 'Average DSO (Days)', color: '#3B82F6' },
          { name: 'Overall Avg DSO', color: '#E76E50' },
        ],
        valueFormat: 'number',
      },
    },
    {
      chartType: 'composed',
      data: [
        { name: 'Prod. A', value: 60, composedValue: 43 },
        { name: 'Prod. B', value: 45, composedValue: 43 },
        { name: 'Prod. C', value: 70, composedValue: 43 },
        { name: 'Prod. D', value: 55, composedValue: 43 },
        { name: 'Prod. E', value: 50, composedValue: 43 },
        { name: 'Prod. F', value: 65, composedValue: 43 },
        { name: 'Prod. G', value: 40, composedValue: 43 },
        { name: 'Prod. H', value: 75, composedValue: 43 },
        { name: 'Prod. I', value: 48, composedValue: 43 },
        { name: 'Prod. J', value: 52, composedValue: 43 },
      ],
      value: 56,
      valueFormat: 'number',
      title: 'Days payable outstanding',
      icon: <Calendar width={16} height={16} />,
      expandible: true,
      withoutExpandHeader: true,
      config: {
        valueFormat: 'number',
        legend: true,
        legendTitle: 'Days payable outstanding (DPO)',
        legendValues: [
          { name: 'Average DPO (Days)', color: '#3B82F6' },
          { name: 'Overall Avg DPO', color: '#E76E50' },
        ],
      },
    },
  ];
};
