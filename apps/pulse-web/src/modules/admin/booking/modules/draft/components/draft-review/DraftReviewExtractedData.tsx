'use client';

import RHFDatePicker from '@/core/components/common/form-inputs/rhf-date-picker';

import RHFTextField from '@/core/components/common/form-inputs/rhf-text-field';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import { RHFPayerFromCombobox } from '@/modules/commons/form/rhf-payer-from-combobox';
import { FC } from 'react';

export const DraftReviewExtractedForm: FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Extracted data</CardTitle>
        <CardDescription>
          Make sure the data extracted matches the data on the order file. You
          can also make adjustments manually
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pb-12">
        <RHFPayerFromCombobox
          label={'Payer'}
          name={'extracted_data.payer_id'}
          required
          placeholder="Select a payer"
          autoClose
          data-cy="draft-review-payer-combobox"
        />
        <RHFTextField
          label={'Net total cost'}
          name={'extracted_data.net_total_io_cost'}
          required
          type="number"
          data-cy="draft-review-net-total-cost-input"
        />
        <RHFTextField
          label={'Total IO impressions'}
          name={'extracted_data.total_io_impressions'}
          type="number"
          data-cy="draft-review-total-io-impressions-input"
        />
        <RHFTextField
          label={'Gross total IO cost'}
          name={'extracted_data.gross_total_io_cost'}
          type="number"
          data-cy="draft-review-gross-total-io-cost-input"
        />
        <RHFDatePicker
          label={'Signed date'}
          name={'extracted_data.signed_at'}
          data-cy="draft-review-signed-date-input"
        />
      </CardContent>
    </Card>
  );
};
