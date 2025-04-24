import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import { cn } from '@/core/lib/utils';

type Props = {
  title: string;
  value: number;
  valueFormat: 'number' | 'currency' | 'percentage';
  children: React.ReactNode;
  className?: string;
};

const StatisticChartCard: React.FC<Props> = ({
  title,
  value,
  children,
  valueFormat,
  className,
}) => {
  const formatValue = (
    numberValue: number,
    valueFormat: 'number' | 'currency' | 'percentage',
  ) => {
    if (valueFormat === 'number') {
      return new Intl.NumberFormat().format(numberValue);
    }
    if (valueFormat === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(numberValue);
    }
    if (valueFormat === 'percentage') {
      return new Intl.NumberFormat('en-US', {
        style: 'percent',
        maximumFractionDigits: 2,
      }).format(numberValue / 100);
    }
    return value;
  };
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-3xl font-semibold">
          {formatValue(value, valueFormat)}
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default StatisticChartCard;
