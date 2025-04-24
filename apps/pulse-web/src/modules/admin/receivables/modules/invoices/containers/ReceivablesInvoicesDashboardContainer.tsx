import TableSkeletonFilters from '@/core/components/common/skeletons/table-skeleton-filters';
import { SearchParams } from '@/server/types/params';
import { Suspense } from 'react';
import ReceivableInvoiceTableActions from '../components/receivables-invoices-table/ReceivableInvoiceTableActions';
import ReceivablesInvoiceRegisterPaymentsModalContainer from './ReceivablesInvoiceRegisterPaymentsModalContainer';
import ReceivablesInvoicesDashboardTableContainer from './ReceivablesInvoicesDashboardTableContainer';

const ReceivablesInvoicesDashboardContainer = ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  return (
    <div className="w-full h-full p-4 flex flex-col gap-4">
      <div className="flex  w-full justify-between">
        <h3 className="text-lg font-semibold">Invoices list</h3>
        <ReceivableInvoiceTableActions searchParams={searchParams}/>
      </div>
      <Suspense fallback={<TableSkeletonFilters filters={5} />}>
        <ReceivablesInvoicesDashboardTableContainer {...{ searchParams }} />
      </Suspense>
      <ReceivablesInvoiceRegisterPaymentsModalContainer />
    </div>
  );
};

export default ReceivablesInvoicesDashboardContainer;
