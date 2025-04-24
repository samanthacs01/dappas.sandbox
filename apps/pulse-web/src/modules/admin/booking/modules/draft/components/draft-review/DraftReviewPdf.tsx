'use client';

import { FC } from 'react';

type DraftReviewPdfProps = {
  pdfUrl: string;
};

export const DraftReviewPdf: FC<DraftReviewPdfProps> = ({ pdfUrl }) => {
  return (
    <iframe
      src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
      className="w-full "
      title="IO Preview"
      data-cy="draft-review-pdf-iframe"
    />
  );
};
