import { z } from 'zod';

export const PackagingInfoSchema = z.object({
  product: z
    .string()
    .optional()
    .describe('The product type for the packaging (e.g., cake, cookies, gift)'),
  brand: z.string().optional().describe('The brand name for the product'),
  description: z.string().optional().describe('A description of the product'),
  colors: z
    .array(z.string())
    .optional()
    .describe('The colors used in the packaging design'),
  style: z.string().optional().describe('The style of the packaging design'),
  logo: z.string().optional().describe('The logo of the brand'),
  packageType: z
    .string()
    .optional()
    .describe('The type of packaging (e.g., box, bag, can)'),
});

export type PackagingInfo = z.infer<typeof PackagingInfoSchema>;
