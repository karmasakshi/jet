import { JetError } from '../classes/jet-error.class.ts';
import { JET_ERROR_MESSAGES } from '../constants/jet-error-messages.constant.ts';

export function getAuthorizationHeader(request: Request): string {
  const authorizationHeader: null | string =
    request.headers.get('Authorization');

  if (!authorizationHeader) {
    throw new JetError(401, JET_ERROR_MESSAGES.UNAUTHORIZED_HEADER_MISSING);
  }

  return authorizationHeader;
}
