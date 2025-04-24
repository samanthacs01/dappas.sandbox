import {
  PayableBills,
  PayableProductionBill,
  PayableProductionFlight,
} from '@/server/types/payable';
import { formatDateUTC } from './date';

export const adaptPayableProductionFlightToPayableBills = (
  flight: PayableProductionFlight,
): PayableBills => ({
  id: flight.billId,
  production: flight.production,
  payment_type: '',
  flight_month: '',
  amount: flight.amount,
  balance: flight.balance,
  due_date: formatDateUTC(flight.due_date),
  status: flight.status,
  identifier: flight.flight,
});

export const convertPayableProductionBillToPayableBills = (
  productionBill: PayableProductionBill,
): PayableBills => {
  const {
    id,
    month,
    net_due,
    revenue,
    balance,
    due_date,
    status,
    billId,
    production,
  } = productionBill;

  return {
    id: id.toString(),
    production,
    payment_type: '',
    flight_month: month?.toString() || null,
    amount: revenue,
    balance,
    due_date: formatDateUTC(due_date),
    status: status?.toString(),
    identifier: billId,
  };
};
