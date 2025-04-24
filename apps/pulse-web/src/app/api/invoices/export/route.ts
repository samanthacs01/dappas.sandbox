import { exportReceivablesInvoices } from '@/server/services/invoices';
import { getServerSession } from 'next-auth';

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  const searchParams = await request.json();

  const respose = await exportReceivablesInvoices(searchParams);
  if (!respose.success) {
    return new Response('Failed to export receivables invoices', {
      status: 400,
    });
  }

  // create a csv file from the response.data and return to the client
  return new Response(respose.data, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="receivables-invoices.csv"',
    },
  });
}
