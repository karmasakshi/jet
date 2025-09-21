import { createRemoteJWKSet, jwtVerify } from '@panva/jose';
import { CustomError } from '../classes/custom-error.class.ts';
import { CustomErrorMessage } from '../enums/custom-error-message.enum.ts';
import { CustomClaims } from '../interfaces/custom-claims.interface.ts';

export async function getCustomClaims(
  authorizationHeader: string,
): Promise<CustomClaims> {
  const jwt: string = authorizationHeader.replace(/^Bearer\s+/i, '').trim();

  if (jwt.split('.').length !== 3) {
    throw new CustomError(401, CustomErrorMessage.UnauthorizedHeaderInvalid);
  }

  const { payload } = await jwtVerify(
    jwt,
    createRemoteJWKSet(
      new URL(`${Deno.env.get('SUPABASE_URL')}/auth/v1/.well-known/jwks.json`),
    ),
  );

  return payload;
}
