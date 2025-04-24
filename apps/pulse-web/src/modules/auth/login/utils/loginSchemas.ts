import z from 'zod';

export const loginSchemas = () =>
  z.object({
    email: z
      .string()
      .min(1, { message: 'Email required' })
      .email('Invalid email'),
    password: z.string().min(1, { message: 'Password required' }).trim(),
  });
