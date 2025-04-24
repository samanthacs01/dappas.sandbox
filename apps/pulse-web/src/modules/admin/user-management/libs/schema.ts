import { z } from 'zod';

export const userSchema = z.object({
  first_name: z.string().nonempty('First name is required'),
  last_name: z.string().nonempty('Last name is required'),
  email: z.string().email('Invalid email'),
  role: z.string().nonempty('Role is required'),
  status: z.boolean()
});
