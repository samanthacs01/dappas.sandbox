import { ReceivedChart } from '@/server/types/chart';
import { PaginatedData, PaginationFilter } from '@/server/types/pagination';
import {
  CollectionRateChart,
  ReceivableOverviewStats,
  ReceivablePayers,
  ReceivablesInvoices,
  ReceivablesInvoiceStatus,
} from '@/server/types/receivables';
import { IQueryable } from '@/server/types/request';

const generateReceivablesInvoice = (): ReceivablesInvoices => {
  const payers = [
    'Google Ads',
    'Meta',
    'Microsoft Advertising',
    'Amazon Ads',
    'Spotify',
    'Apple Media',
    'LinkedIn Ads',
    'Twitter Ads',
    'Criteo',
    'TikTok Ads',
  ];

  const statuses: ReceivablesInvoiceStatus[] = [
    'draft',
    'pending_payment',
    'paid',
    'partial_paid',
  ];

  const amount_to_pay = parseFloat((Math.random() * 100000).toFixed(2));
  const paid_amount =
    Math.random() > 0.5
      ? amount_to_pay
      : parseFloat((Math.random() * amount_to_pay).toFixed(2));

  const currentDate = new Date();
  const dueDate = new Date(currentDate.setDate(currentDate.getDate() + 30));

  return {
    id: Math.floor(10000 + Math.random() * 90000),
    identifier: Math.floor(10000 + Math.random() * 90000).toString(),
    payer: payers[Math.floor(Math.random() * payers.length)],

    productions: [`$${(amount_to_pay * 1.1).toFixed(2)}`],
    bills: [`$${amount_to_pay.toFixed(2)}`],
    amount_to_pay: amount_to_pay,
    balance: paid_amount,
    payment_terms: 30,
    invoice_date: '12/01/2025',
    due_date: dueDate.toISOString().split('T')[0],
    status: statuses[Math.floor(Math.random() * statuses.length)],
  };
};

export const getReceivablesInvoicesMocked = (
  pagination: PaginationFilter,
): PaginatedData<ReceivablesInvoices> => {
  const { page = 1, page_size = 15 } = pagination;
  const totalInvoices = 150;

  const allReceivablesInvoices = Array.from(
    { length: totalInvoices },
    generateReceivablesInvoice,
  );

  const startIndex = (page - 1) * page_size;
  const endIndex = startIndex + page_size;
  const paginatedInvoices = allReceivablesInvoices.slice(startIndex, endIndex);

  return {
    items: paginatedInvoices,
    pagination: {
      page: page + 1,
      per_page: page_size,
      total: totalInvoices,
    },
  };
};

// const generateReceivablePayer = (): ReceivablePayers => {
//   const entityNames = [
//     'Google',
//     'Meta',
//     'Microsoft',
//     'Amazon',
//     'Spotify',
//     'Apple',
//     'LinkedIn',
//     'Twitter',
//     'Criteo',
//     'TikTok',
//   ];

//   const firstName = [
//     'John',
//     'Jane',
//     'Mike',
//     'Emily',
//     'David',
//     'Sarah',
//     'Chris',
//     'Laura',
//     'Alex',
//     'Emma',
//   ];
//   const lastName = [
//     'Smith',
//     'Johnson',
//     'Williams',
//     'Brown',
//     'Jones',
//     'Garcia',
//     'Miller',
//     'Davis',
//     'Rodriguez',
//     'Martinez',
//   ];

//   const randomEntityName =
//     entityNames[Math.floor(Math.random() * entityNames.length)];
//   const randomFirstName =
//     firstName[Math.floor(Math.random() * firstName.length)];
//   const randomLastName = lastName[Math.floor(Math.random() * lastName.length)];

//   return {
//     id: Math.floor(10000 + Math.random() * 90000),
//     entity_name: randomEntityName,
//     entity_address: `${Math.floor(100 + Math.random() * 9900)} ${['Main', 'Oak', 'Maple', 'Cedar', 'Pine'][Math.floor(Math.random() * 5)]} St, ${['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)]}, ${['NY', 'CA', 'IL', 'TX', 'AZ'][Math.floor(Math.random() * 5)]} ${Math.floor(10000 + Math.random() * 90000)}`,
//     contact_name: `${randomFirstName} ${randomLastName}`,
//     contact_phone_number: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
//     contact_email: `contact@${randomEntityName.toLowerCase()}.com`,
//   };
// };

// export const getReceivablePayersMocked = (
//   params: IQueryable,
// ): PaginatedData<ReceivablePayers> => {
//   const page = 1,
//     page_size = 15;
//   const totalPayers = 150;

//   const allReceivablePayers = Array.from(
//     { length: totalPayers },
//     generateReceivablePayer,
//   );

//   const startIndex = (page - 1) * page_size;
//   const endIndex = startIndex + page_size;
//   const paginatedPayers = allReceivablePayers.slice(startIndex, endIndex);

//   return {
//     items: paginatedPayers,
//     pagination: {
//       page: page,
//       per_page: page_size,
//       total: totalPayers,
//     },
//   };
// };

// export const generateRandomReceivablePayers = (): ReceivablePayers => {
//   return {
//     id: Math.floor(Math.random() * 1000), // Random ID between 0-999
//     entity_name: `Company ${Math.floor(Math.random() * 100)}`,
//     entity_address: `${Math.floor(Math.random() * 9999)} Random St, City, Country`,
//     contact_name: `Contact ${Math.floor(Math.random() * 50)}`,
//     contact_phone_number: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
//     contact_email: `contact${Math.floor(Math.random() * 100)}@example.com`,
//   };
// };

export const generateRandomInvoice = (): ReceivablesInvoices => {
  const statuses: ReceivablesInvoiceStatus[] = [
    'draft',
    'pending_payment',
    'paid',
    'partial_paid',
  ];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

  return {
    id: Math.floor(Math.random() * 1000),
    identifier: Math.floor(Math.random() * 1000).toString(),
    payer: `Payer ${Math.floor(Math.random() * 100)}`,
    productions: [`Production ${Math.floor(Math.random() * 50)}`],
    bills: [`Bill ${Math.floor(Math.random() * 50)}`],
    amount_to_pay: Math.floor(Math.random() * 10000) + 1,
    balance: Math.random() * 10000,
    payment_terms: Math.floor(Math.random() * 30) + 1,
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    status: randomStatus,
  };
};

export const _getReceivablesTotalOutstanding = (): ReceivedChart[] => {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const data = Array.from({ length: 10 }, (_, index) => ({
    label: `Payer ${letters[index]}`,
    value: Math.floor(Math.random() * 10000),
  }));

  return data;
};

export const _getReceivablesOverdueInvoice = (): ReceivedChart[] => {
  const letters = [
    'Payer.A',
    'Payer.B',
    'Payer.C',
    'Payer.D',
    'Payer.E',
    'Others',
  ];
  const data = Array.from({ length: 6 }, (_, index) => ({
    label: letters[index],
    value: Math.floor(Math.random() * 10000),
  }));

  return data;
};

export const _getReceivableCollectionRate = (): CollectionRateChart => {
  const randomOverall = Math.floor(Math.random() * 100);
  const randomPaymentTerms = Math.floor(Math.random() * 100);
  return {
    overall: [
      {
        label: 'Paid Invoices',
        value: randomOverall,
      },
      {
        label: 'Unpaid Invoices',
        value: randomOverall / 2,
      },
    ],
    payment_terms: [
      {
        label: 'Paid Within Terms',
        value: randomPaymentTerms,
      },
      {
        label: 'Due  Within Terms Unpaid',
        value: randomPaymentTerms / 2,
      },
    ],
  };
};
