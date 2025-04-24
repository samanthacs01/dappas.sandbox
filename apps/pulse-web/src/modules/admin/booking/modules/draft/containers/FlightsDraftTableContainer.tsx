import { getDraftDetails } from '@/server/services/booking';
import { Params } from '@/server/types/params';
import { FunctionComponent } from 'react';
import { DraftReviewFormContainer } from './DraftReviewFormContainer';

type DraftReviewContainerProps = {
  params: Params;
};

export const DraftReviewContainer: FunctionComponent<
  DraftReviewContainerProps
> = async ({ params }) => {
  const draftId = params.draftId;
  const draftDetails = await getDraftDetails(draftId);

  return <DraftReviewFormContainer draftDetails={draftDetails} />;
};
