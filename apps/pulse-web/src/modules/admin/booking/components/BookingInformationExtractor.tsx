'use client';

import { Progress } from '@/core/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/core/components/ui/tooltip';
import { paths } from '@/core/lib/routes';
import { BookingFilesProcessingStatus } from '@/server/types/booking';
import clsx from 'clsx';
import { ChevronRight, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface BookingInformationExtractorProps {
  information: BookingFilesProcessingStatus;
}

const BookingInformationExtractor = ({
  information: { total, processed },
}: BookingInformationExtractorProps) => {
  const [isCollapse, setIsCollapse] = useState(true);
  const params = Object.values(useParams<Record<string, string>>());
  const pathname = usePathname();

  useEffect(() => {
    const data = localStorage.getItem('booking-extracted-info-collapse');
    setIsCollapse(!!data);
  }, []);

  const handleCollapse = () => {
    localStorage.setItem('booking-extracted-info-collapse', 'true');
    setIsCollapse(true);
  };

  const handleExpand = () => {
    localStorage.removeItem('booking-extracted-info-collapse');
    setIsCollapse(false);
  };

  const isDraft = pathname
    .split('/')
    .filter((segment) => segment && !params.includes(segment))
    .includes('drafts');

  return (
    <aside
      className={clsx(
        'group/root fixed bottom-4 z-50 bg-background  text-card-foreground  max-w-[425px] easy-in-out-card',
        isCollapse
          ? 'w-10 right-0 p-2 flex justify-center items-center rounded-s-md border border-gray-200 hover:shadow-lg cursor-pointer'
          : 'w-full right-5 p-6 rounded-xl shadow-lg dark:border dark:border-gray-500',
      )}
    >
      {isCollapse ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Sparkles
                onClick={handleExpand}
                className="animate-pulse text-primary w-5 h-5"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Show Extracting information</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <>
          <X
            className="absolute top-4 right-4 cursor-pointer"
            onClick={handleCollapse}
          />
          <div className="flex gap-2 items-start w-full">
            <Sparkles className="w-7 h-7 flex-shrink-0" />

            <div className="flex flex-col gap-1 w-full">
              <h3 className="text-lg font-semibold">Extracting information</h3>

              <div className="flex flex-col gap-1 light">
                <Progress
                  value={processed}
                  max={total}
                  className="bg-primary/20 [&_div]:bg-primary"
                />
                <span className="text-muted-foreground text-sm">
                  {processed.toLocaleString()} of {total.toLocaleString()}{' '}
                  Documents
                </span>
              </div>

              {!isDraft && (
                <Link
                  href={paths.booking.drafts.root}
                  className="group flex items-center p-1 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <span className="text-sm font-medium">Go to drafts</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </aside>
  );
};

BookingInformationExtractor.displayName = 'BookingInformationExtractor';

export default BookingInformationExtractor;
