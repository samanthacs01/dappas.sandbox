import { extractPackagingInfo } from '@/server/ai/lib/packaging';
import { tool } from 'ai';
import { z } from 'zod';

const packageInfo = tool({
  description: 'Extract the package info information base on the chat',
  parameters: z.object({
    message: z.string().describe('Ask the user for the next element'),
    packagingInfo: z.object({}).optional(),
  }),
  execute: async (args, { messages }) => {
    const response = await extractPackagingInfo(messages, {});
    return response;
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

export { packageInfo, uploadFile };
