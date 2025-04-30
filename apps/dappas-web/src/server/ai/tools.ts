
import { tool } from 'ai';
import { PackagingInfoSchema } from '../schemas/brand';

const extractPackageInfo = tool({
  description: 'Get the package info from the user message',
  parameters: PackagingInfoSchema,
  execute: async (params) => {
    return params;
  },
});

export { extractPackageInfo };
