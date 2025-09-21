import { RequestFormDataSchema } from '../schemas/request-form-data.schema.ts';
import { RequestFormData } from '../types/request-form-data.type.ts';

export async function getValidatedRequestFormData(
  request: Request,
): Promise<RequestFormData> {
  const formData: FormData = await request.formData();

  const requestFormData: RequestFormData = RequestFormDataSchema.parse({
    exampleFile: formData.get('exampleFile') as File,
    exampleObject: JSON.parse(formData.get('exampleObject') as string),
  });

  return requestFormData;
}
