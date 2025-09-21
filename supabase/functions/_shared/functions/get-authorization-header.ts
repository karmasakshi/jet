import { CustomError } from '../classes/custom-error.class.ts';
import { CustomErrorMessage } from '../enums/custom-error-message.enum.ts';

export function getAuthorizationHeader(request: Request): string {
  const authorizationHeader: null | string =
    request.headers.get('Authorization');

  if (!authorizationHeader) {
    throw new CustomError(401, CustomErrorMessage.UnauthorizedHeaderMissing);
  }

  return authorizationHeader;
}
