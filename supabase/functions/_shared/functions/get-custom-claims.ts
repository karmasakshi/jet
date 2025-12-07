import { createRemoteJWKSet, jwtVerify } from '@panva/jose';
import { JetError } from '../classes/jet-error.class.ts';
import { JET_ERROR_MESSAGES } from '../constants/jet-error-messages.constant.ts';
import { CustomClaims } from '../interfaces/custom-claims.interface.ts';

export async function getCustomClaims(
  authorizationHeader: string,
): Promise<CustomClaims> {
  const jwt: string = authorizationHeader.replace(/^Bearer\s+/i, '').trim();

  if (jwt.split('.').length !== 3) {
    throw new JetError(401, JET_ERROR_MESSAGES.UNAUTHORIZED_HEADER_INVALID);
  }

  const { payload } = await jwtVerify(
    jwt,
    createRemoteJWKSet(
      new URL(`${Deno.env.get('SUPABASE_URL')}/auth/v1/.well-known/jwks.json`),
    ),
  );

  return payload;
}
