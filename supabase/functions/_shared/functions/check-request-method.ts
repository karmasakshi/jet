import { CustomError } from '../classes/custom-error.class.ts';
import { CustomErrorMessage } from '../enums/custom-error-message.enum.ts';

export function checkRequestMethod(
  requestMethod: Request['method'],
  expectedMethod: Request['method'],
): void {
  if (requestMethod !== expectedMethod) {
    throw new CustomError(405, CustomErrorMessage.MethodNotAllowed);
  }
}
