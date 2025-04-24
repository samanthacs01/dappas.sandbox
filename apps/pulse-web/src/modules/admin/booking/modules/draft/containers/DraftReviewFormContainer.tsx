'use client';

import { revalidateServerTags } from '@/core/lib/cache';
import { reviewDraft } from '@/server/services/booking';
import { DraftDetails, ReviewDraftDto } from '@/server/types/booking';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useState } from 'react';
import {
  FieldError,
  FieldErrors,
  FormProvider,
  useForm,
  UseFormProps,
} from 'react-hook-form';
import { toast } from 'sonner';
import { draftDetailsSchema } from '../../../utils/draftReviewSchema';
import { standardizeDropDates } from '../../../utils/parsers';
import { DraftReviewActions } from '../components/draft-review/DraftReviewActions';
import { DraftReviewExtractedForm } from '../components/draft-review/DraftReviewExtractedData';
import { DraftReviewPdf } from '../components/draft-review/DraftReviewPdf';
import { DeleteDraftAlert } from '../components/draft-review/flights-draft-table/DeleteDraftAlert';
import { DeletePayerAlert } from '../components/draft-review/flights-draft-table/DeleteDraftsFlightAlert';
import FlightsDraftTable from '../components/draft-review/flights-draft-table/FlightsDraftTable';

type DraftReviewFormContainerProps = {
  draftDetails: DraftDetails;
};

export const DraftReviewFormContainer: FC<DraftReviewFormContainerProps> = ({
  draftDetails,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const params = useSearchParams();
  const router = useRouter();
  const formOptions: UseFormProps<DraftDetails> = {
    resolver: zodResolver(draftDetailsSchema()),
    defaultValues: draftDetails,
    mode: 'onChange' as const,
    reValidateMode: 'onChange',
  };
  const methods = useForm<DraftDetails>(formOptions);

  const goToNextDraft = () => {
    const ids = params.getAll('draftId');
    const total = parseInt(params.get('totalDrafts') ?? '0');
    const reviewed = parseInt(params.get('reviewedDrafts') ?? '0');

    if (reviewed + 1 < total) {
      const firstDraft = ids.shift();
      const newParams = new URLSearchParams();
      ids.forEach((id) => newParams.append('draftId', id.toString()));
      newParams.set('totalDrafts', total.toString());
      newParams.set('reviewedDrafts', (reviewed + 1).toString());
      router.push(`/booking/drafts/${firstDraft}?${newParams.toString()}`);
    } else {
      router.push('/booking/drafts');
    }
  };

  const onSubmit = async (data: DraftDetails) => {
    setIsLoading(true);

    const reviewDraftDto: ReviewDraftDto = {
      flights: data.flights.map(standardizeDropDates),
      gross_total_io_cost: data.extracted_data.gross_total_io_cost,
      net_total_io_cost: data.extracted_data.net_total_io_cost,
      payer_id: data.extracted_data.payer_id,
      total_io_impressions: data.extracted_data.total_io_impressions,
      signed_at: data.extracted_data.signed_at,
    };

    const response = await reviewDraft(
      draftDetails?.id?.toString() || '',
      reviewDraftDto,
    );

    if (!response.success) {
      toast.error('An error occurred creating the IO');
    } else {
      toast.success('IO created successfully');
      await revalidateServerTags('drafts');
      await revalidateServerTags('insertion-orders');
      goToNextDraft();
    }
    setIsLoading(false);
  };

  const onValidationError = (errors: FieldErrors<DraftDetails>) => {
    let errorsTypes: string[] = [];
    if (errors.extracted_data) {
      errorsTypes = errorsTypes.concat(
        Object.entries(errors.extracted_data)
          .filter(
            ([, value]) =>
              typeof value === 'object' && value !== null && 'type' in value,
          )
          .map(([, value]) => (value as FieldError).type),
      );
    }
    if (errors.flights && Array.isArray(errors.flights)) {
      errors.flights.forEach(
        (flight) =>
          (errorsTypes = errorsTypes.concat(
            Object.entries(flight)
              .filter(
                ([, value]) =>
                  typeof value === 'object' &&
                  value !== null &&
                  'type' in value,
              )
              .map(([, value]) => (value as FieldError).type),
          )),
      );
    }
    const hasInvalidTypes = errorsTypes.some((err) => err === 'invalid_type');
    const hasUncompletedFields = errorsTypes.some((err) => err === 'required');

    if (hasInvalidTypes) {
      toast.error('Please select valid options for Payer/Production fields.');
    }
    if (hasUncompletedFields) {
      toast.error('Please fill in all required fields.');
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        action="#"
        onSubmit={methods.handleSubmit(onSubmit, onValidationError)}
        autoComplete="off"
        className="relative z-10 w-full"
        data-cy="draft-review-form"
      >
        <div className="flex flex-col gap-6">
          <div className="flex gap-6">
            <DraftReviewPdf pdfUrl={draftDetails.file} />
            <DraftReviewExtractedForm />
          </div>
          <FlightsDraftTable />
          <DraftReviewActions loading={isLoading} />
        </div>
      </form>
      <DeleteDraftAlert />
      <DeletePayerAlert />
    </FormProvider>
  );
};
