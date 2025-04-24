import { InsertionOrderStatus } from "@/server/types/booking";

const statusMap: Record<InsertionOrderStatus, string> = {
  pending: 'Pending',
  partial_invoiced: 'Partial invoiced',
  invoiced: 'Invoiced'
};

export const ioTypeRender = (type: InsertionOrderStatus): string => {
  return statusMap[type] || type;
};
