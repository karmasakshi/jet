import { JetError } from '../classes/jet-error.class.ts';
import { JET_ERROR_MESSAGES } from '../constants/jet-error-messages.constant.ts';

export function checkRequestMethod(
  requestMethod: Request['method'],
  expectedMethod: Request['method'],
): void {
  if (requestMethod !== expectedMethod) {
    throw new JetError(405, JET_ERROR_MESSAGES.METHOD_NOT_ALLOWED);
  }
}
