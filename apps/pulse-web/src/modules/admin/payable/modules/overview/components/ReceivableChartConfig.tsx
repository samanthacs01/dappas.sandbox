import { MultipleChart } from '@/server/types/chart';
import { DollarSign, FileClock } from 'lucide-react';

export const receivableChartConfig: MultipleChart[] = [
  {
    chartType: 'bar',
    data: [
      { name: 'Prod. A', value: 7000, fill: '#3B82F6' },
      { name: 'Prod. B', value: 5500, fill: '#3B82F6' },
      { name: 'Prod. C', value: 8000, fill: '#3B82F6' },
      { name: 'Prod. D', value: 6000, fill: '#3B82F6' },
      { name: 'Prod. E', value: 7500, fill: '#3B82F6' },
      { name: 'Prod. F', value: 5000, fill: '#3B82F6' },
      { name: 'Prod. G', value: 6500, fill: '#3B82F6' },
      { name: 'Prod. H', value: 7200, fill: '#3B82F6' },
      { name: 'Prod. I', value: 4800, fill: '#3B82F6' },
      { name: 'Prod. J', value: 5300, fill: '#3B82F6' },
    ],
    title: 'Total Payables Outstanding',
    subtitle: 'Amount Owed/Production',
    value: 74400,
    valueFormat: 'currency',
    expandible: true,
    position: 'vertical',
    icon: <DollarSign width={16} height={16} />,
  },
  {
    chartType: 'stackedBar',
    data: [
      {
        name: 'Current',
        payer_a: 10,
        payer_b: 8,
        payer_c: 12,
        payer_d: 9,
        payer_e: 11,
        others: 15,
      },
      {
        name: '0-30 Days',
        payer_a: 6,
        payer_b: 9,
        payer_c: 8,
        payer_d: 7,
        payer_e: 6,
        others: 5,
      },
      {
        name: '31-60 Days',
        payer_a: 6,
        payer_b: 7,
        payer_c: 9,
        payer_d: 6,
        payer_e: 8,
        others: 5,
      },
      {
        name: '61-90 Days',
        payer_a: 5,
        payer_b: 6,
        payer_c: 4,
        payer_d: 7,
        payer_e: 5,
        others: 8,
      },
      {
        name: '90+ Days',
        payer_a: 5,
        payer_b: 6,
        payer_c: 4,
        payer_d: 7,
        payer_e: 5,
        others: 8,
      },
    ],
    title: 'Total Overdue Bills',
    value: 116,
    valueFormat: 'number',
    expandible: true,
    position: 'vertical',
    icon: <FileClock width={16} height={16} />,
    config: {
      bars: [
        'Payer. A',
        'Payer. B',
        'Payer. C',
        'Payer. D',
        'Payer. E',
        'Others',
      ],
      legendTitle: 'Total Overdue Bills',
      legend: true,
    },
    withoutExpandHeader: true,
  },
  {
    chartType: 'pastel',
    data: [
      { name: 'Bills Paid On Time', value: 40, fill: '#E76E50' },
      { name: 'Bills Due Paid ', value: 60, fill: '#3B82F6' },
    ],
    title: 'On-time Payment Rate',
    expandTitle: 'On-time Payment Rate',
    value: 40,
    valueFormat: 'percentage',
    expandible: true,
    config: {
      legend: false,
      valueFormat: 'percentage',
      tooltip: false,
    },
  },
  {
    chartType: 'bar',
    data: [
      { name: 'Prod. A', value: 7000, fill: '#3B82F6' },
      { name: 'Prod. B', value: 5500, fill: '#3B82F6' },
      { name: 'Prod. C', value: 8000, fill: '#3B82F6' },
      { name: 'Prod. D', value: 6000, fill: '#3B82F6' },
      { name: 'Prod. E', value: 7500, fill: '#3B82F6' },
      { name: 'Prod. F', value: 5000, fill: '#3B82F6' },
      { name: 'Prod. G', value: 6500, fill: '#3B82F6' },
      { name: 'Prod. H', value: 7200, fill: '#3B82F6' },
      { name: 'Prod. I', value: 4800, fill: '#3B82F6' },
      { name: 'Prod. J', value: 5300, fill: '#3B82F6' },
    ],
    title: 'Production Payment on Uncollected Invoices',
    subtitle: 'Amount Paid/Production',
    value: 31300,
    valueFormat: 'currency',
    expandible: true,
    position: 'vertical',
    icon: <DollarSign width={16} height={16} />,
    config: {
      hiddenBarLabel: true,
    },
  },
];
