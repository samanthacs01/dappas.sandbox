import { Button } from '@/core/components/ui/button';
import { paths } from '@/core/lib/routes';
import { Plus } from 'lucide-react';
import Link from 'next/link';

const ReceivablePayerActionsTable = () => {
  return (
    <Link href={paths.receivable.payers.new}>
      <Button>
        <Plus /> Create payer
      </Button>
    </Link>
  );
};

export default ReceivablePayerActionsTable;
