import { DraftStatus } from '@/server/types/booking';

const draftStatusMap: Record<DraftStatus, string> = {
  pending_to_review: 'Pending review',
  extracting_information: 'Extracting information',
  reviewed: 'Reviewed',
  uploaded: 'Uploaded',
  failed: 'Failed',
};

export const draftTypeRender = (type: DraftStatus) => {
  return draftStatusMap[type] || type;
};
