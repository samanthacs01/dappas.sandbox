import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import { cn } from '@/core/lib/utils';
import { type LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface EmptyPlaceholderProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}

export function EmptyPlaceholder({
  icon: Icon,
  title,
  description,
  children,
  className,
}: EmptyPlaceholderProps) {
  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        {Icon && <Icon className="w-16 h-16 text-muted-foreground" />}
        <p className="text-center text-muted-foreground">{description}</p>
      </CardContent>
      {children && (
        <CardFooter className="flex justify-center">{children}</CardFooter>
      )}
    </Card>
  );
}
