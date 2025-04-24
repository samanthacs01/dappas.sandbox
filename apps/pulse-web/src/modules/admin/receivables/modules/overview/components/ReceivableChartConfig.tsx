import { valueFormatter } from '@/core/lib/numbers';
import { MultipleChart } from '@/server/types/chart';
import { DollarSign, FileClock, Percent } from 'lucide-react';
import CollectionRateCharts from './CollectionRateCharts';

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
    title: 'Total Receivables Outstanding',
    subtitle: 'Amount Owed/Payer',
    value: 62800,
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
    title: 'Total Receivables Outstanding',
    subtitle: 'Amount Owed/Payer',
    value: 138,
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
      legendTitle: 'Aging Report',
    },
    withoutExpandHeader: true,
  },

  {
    chartType: 'multiple',
    title: 'Collection rate',
    content: (
      <div className="flex items-center gap-1">
        <p className="text-2xl font-bold">{valueFormatter(80, 'percentage')}</p>
        <span className="text-muted-foreground font-bold text-2xl">/</span>
        <p className="text-2xl font-bold">{valueFormatter(80, 'percentage')}</p>
      </div>
    ),
    icon: <Percent width={16} height={16} />,
    description: 'OverAll/Within P. Terms',
    expandible: true,
    withoutExpandHeader: true,
    config: {
      children: (
        <CollectionRateCharts
          withPayment={[
            {
              name: 'Paid Within Terms',
              value: 35.1,
              fill: '#E76E50',
            },
            { name: 'Due Within Terms Unpaid', value: 64.9, fill: '#3B82F6' },
          ]}
          overallRate={[
            { name: 'Paid Invoices', value: 42.9, fill: '#E76E50' },
            { name: 'Unpaid Invoices', value: 57.1, fill: '#3B82F6' },
          ]}
        />
      ),
    },
  },
  {
    chartType: 'pastel',
    data: [
      { name: 'Payer A', value: 45 },
      { name: 'Payer B', value: 55 },
      { name: 'Payer C', value: 50 },
      { name: 'Payer D', value: 40 },
      { name: 'Payer E', value: 35 },
      { name: 'Others', value: 60 },
    ],

    title: 'Production concentration',
    expandTitle: 'Revenue',
    value: 95.2,
    valueFormat: 'percentage',
    expandible: true,
    config: {
      legend: false,
      valueFormat: 'percentage',
      tooltip: false,
    },
  },
];
