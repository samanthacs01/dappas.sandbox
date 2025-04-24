import z from 'zod';

export const recoverPasswordSchema = () =>
  z.object({
    email: z
      .string()
      .min(1, { message: 'Email required' })
      .email('Invalid email'),
  });
