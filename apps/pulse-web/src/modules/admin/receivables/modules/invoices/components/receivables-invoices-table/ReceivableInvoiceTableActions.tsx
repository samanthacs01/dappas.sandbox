'use client';

import { Button } from '@/core/components/ui/button';
import useDownload from '@/core/hooks/use-download';
import { SearchParams } from '@/server/types/params';
import { FileOutput, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  searchParams: SearchParams;
};

const ReceivableInvoiceTableActions: React.FC<Props> = ({ searchParams }) => {
  const { handleDownloadBlob } = useDownload();
  const [loading, setLoading] = useState(false);

  const downloadInvoices = async () => {
    setLoading(true);

    const response = await fetch('/api/invoices/export', {
      method: 'POST',
      body: JSON.stringify(searchParams),
    });
    if (!response.ok) {
      toast.error('Failed to export receivables invoices');
      setLoading(false);
      return;
    }
    const blob = await response.blob();
    handleDownloadBlob(blob, 'receivables-invoices.csv');
    setLoading(false);
  };

  return (
    <Button onClick={downloadInvoices}>
      <FileOutput />
      Export invoice list
      {loading && <LoaderCircle className="animate-spin w-4 h-4" />}
    </Button>
  );
};

export default ReceivableInvoiceTableActions;
