'use client';
import { FC } from 'react';
import { InsertionOrderUploadButton } from './InsertionOrderUploadButton';

export const InsertionOrdersTableAction: FC = () => {
  return (
    <div className="flex items-center space-x-2 justify-end">
      <InsertionOrderUploadButton />
    </div>
  );
};
