import {
  PayableProductionBill,
  PayableProductionBillStatus,
  PayableProductionExpense,
  PayableProductionFlight,
  ProductionListDto,
} from '@/server/types/payable';
import { PaginatedData } from './../../types/pagination';

const productions: ProductionListDto[] = [
  {
    id: 1,
    entity_name: 'Unexplained',
    balance: 100500,
    dpo: 35,
    payment_type: 'billing',
  },
  {
    id: 2,
    entity_name: 'The Opportunist',
    balance: 100500,
    dpo: 35,
    payment_type: 'collection',
  },
  {
    id: 3,
    entity_name: 'No Chaser with Timothy Chantarangsu',
    balance: 100500,
    dpo: 35,
    payment_type: 'billing',
  },
  {
    id: 4,
    entity_name: 'Hawk vs. Wolf',
    balance: 100500,
    dpo: 35,
    payment_type: 'collection',
  },
  {
    id: 5,
    entity_name: 'Jason Ellis',
    balance: 100500,
    dpo: 35,
    payment_type: 'billing',
  },
];

export const getPayableProductions = async (): Promise<
  PaginatedData<ProductionListDto>
> => {
  return await Promise.resolve({
    pagination: { page: 1, total: 50, per_page: 10 },
    items: productions,
  });
};

export const payableBillsStatus = [
  { label: 'Paid', value: 'PAID' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Partially Paid', value: 'PARTIAL_PAID' },
];

// export const getPayableProductionBillsMocked = (): PayableProductionBill[] => {
//   const page = 1;
//   const page_size = 15;
//   const totalBills = 50;

//   const allBills = Array.from({ length: totalBills }, (_, index) => {
//     const month = (index % 12) + 1; // Month from 1 to 12
//     const revenue = Math.floor(10000 + Math.random() * 90000);
//     const expenses = Math.floor(5000 + Math.random() * 40000);
//     const net_due = revenue - expenses;
//     const balance = Math.floor(Math.random() * net_due); // Balance can be between 0 and net_due
//     const due_date = new Date();
//     due_date.setDate(due_date.getDate() + Math.floor(Math.random() * 30)); // Random date in the next 30 days
//     const status = ['partially_paid', 'paid', 'pending_payment'][
//       Math.floor(Math.random() * 3)
//     ] as PayableProductionBillStatus;

//     return {
//       id: 1,
//       month,
//       revenue,
//       expenses,
//       net_due,
//       balance,
//       due_date,
//       status,
//     };
//   });

//   const startIndex = (page - 1) * page_size;
//   const endIndex = startIndex + page_size;

//   return allBills.slice(startIndex, endIndex);
// };

// export const getPayableProductionFlightsMocked =
//   (): PayableProductionFlight[] => {
//     const page = 1;
//     const page_size = 15;
//     const totalFlights = 50;

//     const allFlights = Array.from({ length: totalFlights }, (_, index) => {
//       const flight = `FLIGHT-${index + 1}`;
//       const payer = `PAYER-${Math.floor(Math.random() * 10) + 1}`; // 10 different payers
//       const revenue = Math.floor(10000 + Math.random() * 90000);
//       const due_date = new Date();
//       due_date.setDate(due_date.getDate() + Math.floor(Math.random() * 30));
//       const status = ['partially_paid', 'paid', 'pending_payment'][
//         Math.floor(Math.random() * 3)
//       ] as PayableProductionBillStatus;

//       return {
//         id: 1,
//         flight,
//         payer,
//         revenue,
//         due_date,
//         status,
//       };
//     });

//     const startIndex = (page - 1) * page_size;
//     const endIndex = startIndex + page_size;

//     return allFlights.slice(startIndex, endIndex);
//   };

export const getPayableProductionExpensesMocked = (
  page: number = 1,
  pageSize: number = 15,
  totalExpenses: number = 50,
): PayableProductionExpense[] => {
  const allExpenses = Array.from({ length: totalExpenses }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 365));
    return {
      date: date.toISOString().split('T')[0],
      total_deduction: Math.floor(100 + Math.random() * 900).toString(),
    };
  });

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return allExpenses.slice(startIndex, endIndex);
};

export const _payableOverviewTotalOutstandingMock = [
  { label: 'Prod. A', value: 7000 },
  { label: 'Prod. B', value: 5500 },
  { label: 'Prod. C', value: 8000 },
  { label: 'Prod. D', value: 6000 },
  { label: 'Prod. E', value: 7500 },
  { label: 'Prod. F', value: 5000 },
  { label: 'Prod. G', value: 6500 },
  { label: 'Prod. H', value: 7200 },
  { label: 'Prod. I', value: 4800 },
  { label: 'Prod. J', value: 5300 },
];
