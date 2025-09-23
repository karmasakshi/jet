import { z } from '@zod/zod';

export const RequestFormDataSchema = z
  .object({
    exampleFile: z.file().describe(''),
    exampleObject: z.object({}).describe(''),
  })
  .describe('');
