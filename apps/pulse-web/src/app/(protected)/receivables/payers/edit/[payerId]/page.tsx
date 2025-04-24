import ReceivableNewPayerFormContainer from '@/modules/admin/receivables/modules/payers/containers/ReceivableNewPayerFormContainer';
import { getReceivablePayerDetails } from '@/server/services/receivables';
import { PageProps } from '@/server/types/pages';

export default async function Page(props: PageProps) {
  const params = await props.params;

  const { payerId } = params;

  const payerDetails = await getReceivablePayerDetails(payerId);

  return (
    <div className="p-8">
      <ReceivableNewPayerFormContainer payerDetails={payerDetails} />
    </div>
  );
}
