import { ComboBoxOption } from '@/server/types/combo-box';

export const payableProductionBillStatus: ComboBoxOption[] = [
  {
    value: 'paid',
    label: 'Paid',
  },
  {
    value: 'partially_paid',
    label: 'Partially Paid',
  },
  {
    value: 'pending',
    label: 'Pending',
  },
];
