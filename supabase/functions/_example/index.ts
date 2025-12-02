// deno-lint-ignore no-import-prefix no-unversioned-import
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { CustomError } from '@shared/classes/custom-error.class.ts';
import { COMMON_HEADERS } from '@shared/constants/common-headers.constant.ts';
import { checkIsAdmin } from '@shared/functions/check-is-admin.ts';
import { checkIsBelowRateLimit } from '@shared/functions/check-is-below-rate-limit.ts';
import { checkRequestMethod } from '@shared/functions/check-request-method.ts';
import { convertFileToDataUrl } from '@shared/functions/convert-file-to-data-url.ts';
import { getAuthorizationHeader } from '@shared/functions/get-authorization-header.ts';
import { getCustomClaims } from '@shared/functions/get-custom-claims.ts';
import { getSupabaseUserClient } from '@shared/functions/get-supabase-user-client.ts';
import { CustomClaims } from '@shared/interfaces/custom-claims.interface.ts';
import { SupabaseClient } from '@supabase/supabase-js';
import { z } from '@zod/zod';
import { getValidatedRequestFormData } from './functions/get-validated-request-form-data.ts';
import { RequestFormData } from './types/request-form-data.type.ts';

addEventListener('beforeunload', (event: unknown): void => {
  // @ts-expect-error: https://supabase.com/docs/guides/functions/background-tasks#example
  console.warn('Edge Function shutting down: ', event.detail?.reason);
});

Deno.serve(async (request: Request): Promise<Response> => {
  console.info(
    'Incoming request:',
    request.method,
    'Origin:',
    request.headers.get('origin') ?? 'N/A',
  );

  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: COMMON_HEADERS });
    }

    checkRequestMethod(request.method, 'POST');

    const authorizationHeader: string = getAuthorizationHeader(request);

    const { sub: userId }: CustomClaims =
      await getCustomClaims(authorizationHeader);

    await checkIsBelowRateLimit(userId);

    const supabaseUserClient: SupabaseClient =
      getSupabaseUserClient(authorizationHeader);

    await checkIsAdmin(userId, supabaseUserClient);

    const { exampleFile, exampleObject }: RequestFormData =
      await getValidatedRequestFormData(request);

    const dataUrl: string = await convertFileToDataUrl(exampleFile);

    return new Response(JSON.stringify({ dataUrl, exampleObject }), {
      headers: COMMON_HEADERS,
    });
  } catch (exception: unknown) {
    let message = 'Something went wrong.';
    let httpStatusCode = 500;

    if (exception instanceof CustomError) {
      message = exception.message;
      httpStatusCode = exception.httpStatusCode;
    } else if (exception instanceof z.ZodError) {
      message = `Bad request. ${exception.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('. ')}.`;

      httpStatusCode = 400;
    } else {
      console.log(exception);

      if (exception instanceof Error) {
        message = exception.message;
      }
    }

    return new Response(JSON.stringify({ error: message }), {
      headers: COMMON_HEADERS,
      status: httpStatusCode,
    });
  }
});
