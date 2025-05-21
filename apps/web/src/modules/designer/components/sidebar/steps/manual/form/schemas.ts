import { z } from 'zod';

const ColorsLogoSchema = z.object({
  colors: z
    .array(z.string(), { required_error: 'The colors field is required' })
    .min(1, {
      message: 'At least one color is required',
    }),
  logo: z.instanceof(File, { message: 'The logo is required' }).refine(
    (file) => {
      console.log('file', file);
      const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
      return file && validTypes.includes(file.type);
    },
    {
      message: 'Logo must be a valid image file (JPEG, PNG, SVG)',
    },
  ),
});

const BrandBasicInfoSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required',
  }),
  industry: z.string().min(1, {
    message: 'Industry is required',
  }),
  website: z
    .string()
    .min(1, { message: 'Website is required' })
    .refine((val) => /\.[a-zA-Z]{2,}$/.test(val), {
      message: 'Website must contain a valid domain (e.g., google.com)',
    }),
  location: z.string().min(1, {
    message: 'Location is required',
  }),
});

const CartInfoSchema = z.object({
  quantity: z.number({
    message: 'Quantity is required',
  }),
});

export type ColorsLogoType = z.infer<typeof ColorsLogoSchema>;
export type BrandBasicInfoType = z.infer<typeof BrandBasicInfoSchema>;
export type CartInfoType = z.infer<typeof CartInfoSchema>;

export { CartInfoSchema, BrandBasicInfoSchema, ColorsLogoSchema };
