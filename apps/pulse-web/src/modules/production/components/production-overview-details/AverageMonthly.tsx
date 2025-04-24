import { fCurrency } from '@/core/lib/numbers';
import { ArrowUp } from 'lucide-react';
import { FC } from 'react';

type Props = {
  amount: number;
};

const AverageMonthly: FC<Props> = ({ amount }) => {
  return (
    <div className="flex items-center gap-2">
      <h3 className="font-bold text-2xl">{fCurrency({ amount })}</h3>

      <div className="flex items-center">
        <ArrowUp width={16} height={16} className="text-green-600" />
        <span className="text-green-600 text-lg font-bold">5%</span>
      </div>
    </div>
  );
};

export default AverageMonthly;
