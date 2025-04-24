import { z } from 'zod';

export const registerPayFormSchema = (maxAmount: number) =>
  z.object({
    payment_amount: z
      .number()
      .min(0, 'Payment amount must be greater than 0')
      .lte(maxAmount, {
        message: 'The amount to pay cannot exceed the available balance',
      })
      .refine((value) => !!value, 'Payment amount is required'),
  });

export const createNewPayerSchema = z.object({
  entity_name: z.string().nonempty('Entity name is required'),
  entity_address: z.string().nullable(),
  contact_name: z.string().nonempty('Contact name is required'),
  contact_phone_number: z.string().nonempty('Contact phone number is required'),
  contact_email: z.string().email('Contact email is not valid'),
  payment_terms: z.number().gt(0, {
    message: 'Payment Terms is not valid',
  }),
});
