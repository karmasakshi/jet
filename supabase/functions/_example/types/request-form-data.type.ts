import { z } from '@zod/zod';
import { RequestFormDataSchema } from '../schemas/request-form-data.schema.ts';

export type RequestFormData = z.infer<typeof RequestFormDataSchema>;
