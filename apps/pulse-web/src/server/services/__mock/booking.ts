import {
  Draft,
  DraftDetails,
  DraftExtractedData,
  DraftFlights,
  DraftStatus,
  Flight,
  FlightStatus,
  InsertionOrder,
  InsertionOrderStatus,
  Invoice,
} from '@/server/types/booking';
import { PaginatedData, PaginationFilter } from '@/server/types/pagination';

// export const getInsertionOrdersMocked = (
//   pagination: PaginationFilter,
// ): PaginatedData<InsertionOrder> => {
//   const { page = 1, page_size = 15 } = pagination;
//   const totalOrders = 150;

//   const allInsertionOrders = Array.from(
//     { length: totalOrders },
//     (_, index) => ({
//       id: index + 1,
//       insertion_order: `IO-${Math.floor(10000 + Math.random() * 90000)}`,
//       payer: [
//         'Google Ads',
//         'Meta',
//         'Microsoft Advertising',
//         'Amazon Ads',
//         'Spotify',
//         'Apple Media',
//         'LinkedIn Ads',
//         'Twitter Ads',
//         'Criteo',
//         'TikTok Ads',
//       ][Math.floor(Math.random() * 10)],
//       net_total_io_cost: Number((Math.random() * 50000).toFixed(2)),
//       total_io_impressions: Math.floor(Math.random() * 1000000).toString(),
//       gross_total_io_cost: Number((Math.random() * 100000).toFixed(2)),
//       status: ['INVOICED', 'PARTIALLY_INVOICED', 'PENDING'][
//         Math.floor(Math.random() * 3)
//       ] as InsertionOrderStatus,
//     }),
//   );

//   const startIndex = (page - 1) * page_size;
//   const endIndex = startIndex + page_size;

//   return {
//     items: allInsertionOrders.slice(startIndex, endIndex),
//     pagination: {
//       page: page,
//       per_page: page_size,
//       total: totalOrders,
//     },
//   };
// };

export const getDraftsMocked = (
  pagination: PaginationFilter,
): PaginatedData<Draft> => {
  const { page = 1, page_size = 15 } = pagination;
  const totalDrafts = 50;

  const allDrafts = Array.from({ length: totalDrafts }, () => ({
    id: Math.floor(10000 + Math.random() * 90000),
    file_name: [
      'contract_google.pdf',
      'agreement_meta.docx',
      'proposal_microsoft.pdf',
      'media_plan_amazon.xlsx',
      'campaign_spotify.docx',
      'insertion_order_apple.pdf',
      'draft_linkedin.pdf',
      'brief_twitter.docx',
      'marketing_plan_criteo.xlsx',
      'strategy_tiktok.pdf',
    ][Math.floor(Math.random() * 10)],
    status: ['EXTRACTING_INFORMATION', 'PENDING_TO_REVIEW'][
      Math.floor(Math.random() * 2)
    ] as DraftStatus,
  }));

  const startIndex = (page - 1) * page_size;
  const endIndex = startIndex + page_size;

  return {
    items: allDrafts.slice(startIndex, endIndex),
    pagination: {
      page: page,
      per_page: page_size,
      total: totalDrafts,
    },
  };
};

// export const getDraftDetailsMocked = (draftId: number): DraftDetails => {
//   const pdfUrls = [
//     'https://storage.googleapis.com/pulse-pdfs-temp/f_arn_iheart_podcast.pdf',
//     'https://storage.googleapis.com/pulse-pdfs-temp/f_kas_mtv.pdf',
//     'https://storage.googleapis.com/pulse-pdfs-temp/f_nord_vpn.pdf',
//     'https://storage.googleapis.com/pulse-pdfs-temp/f_kast_eczema.pdf',
//   ];

//   const mockExtractedData: DraftExtractedData = {
//     io_number: Math.floor(10000 + Math.random() * 90000),
//     payer: ['Google Inc', 'Meta Platforms', 'Amazon', 'Microsoft', 'Apple'][
//       Math.floor(Math.random() * 5)
//     ],
//     net_total_cost: Math.floor(Math.random() * 100000),
//     total_io_impressions: Math.floor(Math.random() * 1000000),
//     gross_total_io_cost: Math.floor(Math.random() * 150000),
//     signed_date: new Date().toISOString(), // Added signed_date
//   };

//   const mockFlights: DraftFlights[] = Array.from(
//     { length: Math.floor(1 + Math.random() * 10 + 3) },
//     (_, index) => ({
//       id: `flight-${index}`, // Added ID
//       production: [
//         'Digital Video',
//         'Display',
//         'Social Media',
//         'Native Advertising',
//       ][Math.floor(Math.random() * 4)],
//       advertiser: ['Advertiser A', 'Advertiser B', 'Advertiser C'][
//         Math.floor(Math.random() * 3)
//       ],
//       media: ['Media 1', 'Media 2', 'Media 3'][Math.floor(Math.random() * 3)],
//       ads_type: ['Banner', 'Pre-roll', 'Mid-roll', 'Post-roll', 'Interstitial'][
//         Math.floor(Math.random() * 5)
//       ],
//       placement: ['YouTube', 'Facebook', 'Instagram', 'LinkedIn', 'TikTok'][
//         Math.floor(Math.random() * 5)
//       ],
//       length: [15, 30, 60][Math.floor(Math.random() * 3)],
//       cpm: Math.floor(Math.random() * 50),
//       total_cost: Math.floor(Math.random() * 25000),
//       dates: [
//         new Date(
//           2024,
//           Math.floor(Math.random() * 12),
//           Math.floor(1 + Math.random() * 28),
//         ),
//         new Date(
//           2024,
//           Math.floor(Math.random() * 12),
//           Math.floor(1 + Math.random() * 28),
//         ),
//       ],
//       impressions: Math.floor(Math.random() * 100000),
//       promo_code: `PROMO-${Math.floor(1000 + Math.random() * 9000)}`,
//     }),
//   );

//   return {
//     pdfUrl: pdfUrls[Math.floor(Math.random() * pdfUrls.length)],
//     extractedData: mockExtractedData,
//     flights: mockFlights,
//   };
// };

// export const getFlightsMocked = (
//   pagination: PaginationFilter,
// ): PaginatedData<Flight> => {
//   const { page = 1, page_size = 15 } = pagination;
//   const totalFlights = 200;

//   const allFlights = Array.from({ length: totalFlights }, () => ({
//     id: Math.floor(10000 + Math.random() * 90000),
//     identifier: `IO-${Math.floor(Math.random() * 1000)}`,
//     insertion_order: Math.floor(Math.random() * 1000),
//     payer: [
//       'American Airlines',
//       'United Airlines',
//       'Delta Air Lines',
//       'Southwest Airlines',
//       'JetBlue Airways',
//     ][Math.floor(Math.random() * 5)],
//     production: [
//       'Google Ads',
//       'Meta',
//       'Microsoft Advertising',
//       'Amazon Ads',
//       'Spotify',
//       'Apple Media',
//       'LinkedIn Ads',
//       'Twitter Ads',
//       'Criteo',
//       'TikTok Ads',
//     ][Math.floor(Math.random() * 3)],
//     total_cost: (Math.random() * 100000).toFixed(2),
//     drop_dates: [
//       new Date(Date.now() - Math.floor(Math.random() * 31536000000))
//         .toISOString()
//         .split('T')[0],
//     ],
//     status: ['PENDING', 'INVOICED'][
//       Math.floor(Math.random() * 2)
//     ] as FlightStatus,
//   }));

//   const startIndex = (page - 1) * page_size;
//   const endIndex = startIndex + page_size;

//   return {
//     items: allFlights.slice(startIndex, endIndex),
//     pagination: {
//       page: page,
//       per_page: page_size,
//       total: totalFlights,
//     },
//   };
// };

export const getInvoicesMocked = (): Invoice[] => {
  const totalInvoices = 20;

  const allInvoices = Array.from({ length: totalInvoices }, () => ({
    id: Math.floor(10000 + Math.random() * 90000),
    payer: [
      'Google Inc.',
      'Apple Inc.',
      'Microsoft Corporation',
      'Amazon.com',
      'Facebook, Inc.',
      'Netflix, Inc.',
      'Adobe Inc.',
      'Salesforce',
      'Oracle Corporation',
      'IBM',
    ][Math.floor(Math.random() * 10)],
    amount_to_pay: Number((Math.random() * 50000).toFixed(2)),
    payment_terms: [15, 30, 45, 60, 90][Math.floor(Math.random() * 5)],
    due_date: new Date(Date.now() + Math.floor(Math.random() * 31536000000)),
  }));

  return allInvoices;
};
