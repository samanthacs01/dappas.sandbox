import { MultipleChart } from '@/server/types/chart';
import { DollarSign } from 'lucide-react';
import React from 'react';
import AverageMonthly from './AverageMonthly';

export const ProductionDetailsChartsConfig = (): MultipleChart[] => {
  return [
    {
      chartType: 'bar',
      data: [
        { name: 'Jan, 2025', value: 8000 },
        { name: 'Feb, 2025', value: 6500 },
        { name: 'Mar, 2025', value: 9000 },
        { name: 'Apr, 2025', value: 7000 },
        { name: 'May, 2025', value: 7500 },
        { name: 'Jun, 2025', value: 6000 },
        { name: 'Jul, 2025', value: 8500 },
      ],
      title: 'Booking',
      subtitle: 'Value/Date',
      value: 128100,
      valueFormat: 'currency',
      expandible: true,
      position: 'vertical',
      icon: <DollarSign width={16} height={16} />,
    },
    {
      chartType: 'bar',
      data: [
        { name: 'Jan, 2025', value: 3600 },
        { name: 'Feb, 2025', value: 2650 },
        { name: 'Mar, 2025', value: 3800 },
        { name: 'Apr, 2025', value: 2900 },
        { name: 'May, 2025', value: 3000 },
        { name: 'Jun, 2025', value: 2550 },
        { name: 'Jul, 2025', value: 3500 },
      ],
      title: 'Net Revenue',
      subtitle: 'Value/Date',
      value: 13100,
      valueFormat: 'currency',
      expandible: true,
      position: 'vertical',
      icon: <DollarSign width={16} height={16} />,
    },
    {
      title: 'Next Payment Date and Amount',
      description: 'April 2, 2024',
      value: 13100,
      valueFormat: 'currency',
      expandible: false,
    },
    {
      title: 'Average Monthly Revenue',
      content: <AverageMonthly amount={13100} />,
      expandible: false,
    },
  ];
};
