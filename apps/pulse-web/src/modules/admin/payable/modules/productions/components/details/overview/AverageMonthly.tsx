import { valueFormatter } from '@/core/lib/numbers';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { FC } from 'react';

type Props = {
  amount: number;
  variance: number;
};

const AverageMonthly: FC<Props> = ({ amount, variance }) => {
  return (
    <div className="flex items-center gap-2">
      <h3 className="font-bold text-2xl">
        {valueFormatter(amount, 'currency')}
      </h3>

      <div className="flex items-center">
        {variance < 0 ? (
          <ArrowDown width={16} height={16} className="text-red-600" />
        ) : (
          <ArrowUp width={16} height={16} className="text-green-600" />
        )}
        <span
          className={`text-lg font-bold ${
            variance < 0 ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {valueFormatter(variance, 'percentage')}
        </span>
      </div>
    </div>
  );
};

export default AverageMonthly;
