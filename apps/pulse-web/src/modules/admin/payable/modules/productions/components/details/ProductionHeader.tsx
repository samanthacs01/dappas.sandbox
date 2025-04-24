import { Button } from '@/core/components/ui/button';
import { Label } from '@/core/components/ui/label';
import { paths } from '@/core/lib/routes';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { FC, Suspense } from 'react';
import { ProductionDetailsTabPanelContainer } from './ProductionDetailsTabPanelContainer';

type ProductionHeaderProps = {
  name: string;
};

export const ProductionHeader: FC<ProductionHeaderProps> = ({ name }) => {
  return (
    <>
      <div className="space-x-4">
        <Link href={paths.payable.productions.root}>
          <Button variant={'outline'} className="h-7 w-7 p-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <Label className="text-xl font-semibold">Production: {name}</Label>
      </div>
      <Suspense>
        <ProductionDetailsTabPanelContainer />
      </Suspense>
    </>
  );
};
