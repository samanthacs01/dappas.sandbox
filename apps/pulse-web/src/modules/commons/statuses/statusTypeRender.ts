const statusTypeMap: Record<string, string> = {
  paid: 'Paid',
  pending: 'Pending',
  partial_paid: 'Partially paid',
  pending_payment: 'Pending payment',
};

export const statusTypeRender = (type: string): string => {
  return statusTypeMap[type] || type;
};
