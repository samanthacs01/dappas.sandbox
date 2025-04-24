import { z } from 'zod';

const existingFileSchema = z.object({
  name: z.string(),
  path: z.string().url(),
});
const fileField = z.custom<File>(
  (value) => !(value instanceof File),
  'File required',
);

export const productionsSchema = z.object({
  entity_name: z.string().min(2, 'Entity name must be at least 2 characters'),
  entity_address: z.string().optional(),
  contact_name: z.string().min(2, 'Contact name must be at least 2 characters'),
  contact_phone_number: z
    .string()
    .min(10, 'Contact phone number must be at least 10 characters'),
  contact_email: z.string().email('Invalid email address'),
  production_split: z.number().refine(
    (val) => {
      const regex = /^(100|([1-9]\d?)(\.\d)?)$/;
      return regex.test(val.toString());
    },
    {
      message:
        'Please enter a number between 1 and 100, with up to one digit after the decimal point',
    },
  ),
  production_billing_type: z.enum(['billing', 'collection']),
  net_payment_terms: z
    .number()
    .int('Net payment terms must be a integer value ')
    .min(1, 'Net payment terms must be at least 1'),
  production_expense_recoupment_type: z.enum(['before', 'after']),
  contract_file: z
    .union([fileField, existingFileSchema])
    .refine((value) => !!value, { message: 'Contract is required' }),
});
