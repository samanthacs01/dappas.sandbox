import { Button } from '@/core/components/ui/button';
import { Label } from '@/core/components/ui/label';
import DraftReviewSkeleton from '@/modules/admin/booking/modules/draft/components/draft-review/DraftReviewSkeleton';
import { DraftReviewContainer } from '@/modules/admin/booking/modules/draft/containers/FlightsDraftTableContainer';
import { PageProps } from '@/server/types/pages';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

export default async function Page(props: Readonly<PageProps>) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const { totalDrafts, reviewedDrafts } = searchParams;

  return (
    <div className="flex flex-col px-8 py-4 gap-4 w-full z-0">
      <div className="flex justify-between">
        <div className="space-x-4">
          <Link href={'/booking/drafts'}>
            <Button variant="outline" className="w-9">
              <ChevronLeft />
            </Button>
          </Link>
          <Label className="text-xl font-semibold">Review drafts</Label>
        </div>
        <div className="flex items-center">
          <Label className="text-lg font-semibold">
            {+(reviewedDrafts ?? 0) + 1}/{totalDrafts ?? 1}
          </Label>
        </div>
      </div>

      <Suspense fallback={<DraftReviewSkeleton />}>
        <DraftReviewContainer params={params} />
      </Suspense>
    </div>
  );
}
