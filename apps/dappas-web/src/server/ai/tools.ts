import {
  extractPackagingInfo,
  generativeInferBrandInfo,
} from '@/server/ai/lib/packaging';
import { tool, UIMessage } from 'ai';
import { z } from 'zod';

const packageInfo = tool({
  description: 'Extract the package info information base on the chat',
  parameters: z.object({
    message: z.string().describe('Ask the user for the next element'),
    packagingInfo: z.object({}).optional(),
  }),
  execute: async (args, { messages }) => {
    return extractPackagingInfo(messages as UIMessage[], {});
  },
});

const uploadFile = tool({
  description: 'Ask the user for a logo file',
  parameters: z.object({
    message: z
      .string()
      .describe('Please use this component to upload the logo'),
  }),
  execute: async (params) => {
    return params;
  },
});

const inferBrandInfo = tool({
  description:
    'Search in the instagram account or website url for a brand, logo, vibes and colors.',
  parameters: z.object({
    instagram: z.string().describe('Instagram account'),
    url: z.string().describe('Brand url website'),
  }),
  execute: async (params) => {
    return generativeInferBrandInfo(params.instagram, params.url);
  },
});

export { inferBrandInfo, packageInfo, uploadFile };
