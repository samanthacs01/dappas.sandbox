import { Button } from '@/core/components/ui/button';
import { valueFormatter } from '@/core/lib/numbers';
import { cn } from '@/core/lib/utils';
import { ChevronRight, LineChart } from 'lucide-react';
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../ui/card';

interface StaticCardProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  content?: React.ReactNode;
  value?: number | string;
  className?: string;
  expandible?: boolean;
  onExpand?: () => void;
  valueFormat?: 'number' | 'currency' | 'percentage';
}

const StaticCard = ({
  title,
  description,
  icon,
  content,
  value,
  className,
  expandible,
  onExpand,
  valueFormat,
}: Readonly<StaticCardProps>) => {
  return (
    <Card className={cn(`w-full flex flex-col justify-between p-6`, className)}>
      <div className="space-y-2">
        {title && (
          <CardHeader className="p-0">
            <div className="flex place-content-between flex-1 items-start gap-6">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {description && (
                  <CardDescription className="font-normal">
                    {description}
                  </CardDescription>
                )}
              </div>
              {icon && <span className="h-4 w-4">{icon}</span>}
            </div>
          </CardHeader>
        )}

        <CardContent className="p-0">
          {content && content}
          {!content && (
            <p className="text-2xl font-bold">
              {valueFormatter(value ?? 0, valueFormat ?? 'number')}
            </p>
          )}
        </CardContent>
      </div>
      {expandible && (
        <CardFooter className="p-0">
          <Button
            variant="link"
            size="sm"
            onClick={onExpand}
            className="mt-2 px-0"
            data-cy="static-card-expand-button"
          >
            <LineChart /> Expand chart <ChevronRight />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default StaticCard;
