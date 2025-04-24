import { Button } from '@/core/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface ErrorDisplayProps {
  message: string;
  href?: string;
  link_text?: string;
}

export default function ErrorDisplay({
  message,
  href,
  link_text,
}: Readonly<ErrorDisplayProps>) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Oops! Something went wrong
        </h1>
        <p className="text-muted-foreground">{message}</p>
        <Link href={href ?? '/'}>
          <Button variant={'link'} className="mt-2">
            <ChevronLeft /> {link_text ?? 'Return home'}
          </Button>
        </Link>
      </div>
    </div>
  );
}
