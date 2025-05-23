import { z } from 'zod';

const ManualInfoSchema = z.object({
    name: z.string().min(1, {
    message: 'Name is required',
  }),
  industry: z.string().min(1, {
    message: 'Industry is required',
  }),
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
  styles: z.array(z.string()).optional(),
});


const CartInfoSchema = z.object({
  quantity: z.number({
    message: 'Quantity is required',
  }),
});

export type ManualInfoType = z.infer<typeof ManualInfoSchema>;
export type CartInfoType = z.infer<typeof CartInfoSchema>;

export { CartInfoSchema, ManualInfoSchema as ColorsLogoSchema };

