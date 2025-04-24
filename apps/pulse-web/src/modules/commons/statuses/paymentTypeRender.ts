import { PaymentType } from '@/server/types/payable';

const paymentTypeMap: Record<PaymentType, string> = {
  collection: 'Collection',
  billing: 'Billing',
};

export const paymentTypeRender = (type: PaymentType) => {
  return paymentTypeMap[type] || type;
};
