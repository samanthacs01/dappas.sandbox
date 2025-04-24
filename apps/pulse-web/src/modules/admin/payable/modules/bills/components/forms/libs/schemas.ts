import { z } from 'zod';

export const registerBillsPaymentSchema = (maxAmount: number) => z.object({
  amount: z
    .number()
    .min(0, 'Payment amount must be greater than 0')
    .lte(maxAmount, {
      message: 'The amount to pay cannot exceed the balance',
    })
    .refine((value) => !!value, 'Payment amount is required'),
});
