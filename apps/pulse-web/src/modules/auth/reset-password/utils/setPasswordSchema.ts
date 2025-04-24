import z from 'zod';

export const setPasswordSchema = () =>
  z
    .object({
      password: z.string().min(1, { message: 'Password required' }).max(255),
      repeatPassword: z
        .string()
        .min(1, { message: 'Repeat password required' })
        .max(255),
    })
    .refine((data) => data.password === data.repeatPassword, {
      path: ['repeatPassword'],
      message: "Passwords don't match.",
    });
