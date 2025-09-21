import { z } from '@zod/zod';

export const RequestFormDataSchema = z.object({
  exampleFile: z.file(),
  exampleObject: z.object({}),
});
