import { z } from 'zod';

const CartInfoSchema = z.object({
  quantity: z.number({
    message: 'Quantity is required',
  }),
});

export type CartInfoType = z.infer<typeof CartInfoSchema>;

export { CartInfoSchema };

