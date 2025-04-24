import { z } from 'zod';

const fileField = z.custom<File>(
  (value) => value instanceof File,
  'File required',
);

const existingFileSchema = z.object({
  name: z.string(),
  path: z.string().url(),
});

export const expenseSchema = z.object({
  files: z
    .array(z.union([fileField, existingFileSchema]))
    .refine((val) => !!val.length, { message: 'Expense files are required' }),
  month: z.string(),
  production_id: z
    .number({ invalid_type_error: 'Only numbers are allowed' })
    .min(1, 'This field is required'),
  total_deduction: z
    .number({ invalid_type_error: 'Only numbers are allowed' })
    .min(1, 'This field is required'),
});
