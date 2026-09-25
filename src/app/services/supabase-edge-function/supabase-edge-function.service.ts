import { inject, Service } from '@angular/core';
import { REQUEST_TIMEOUT_MS } from '@jet/constants/request-timeout-ms.constant';
import { SupabaseEdgeFunction } from '@jet/enums/supabase-edge-function.enum';
import { SUPABASE_CLIENT } from '@jet/injection-tokens/supabase-client.injection-token';
import { FunctionInvokeOptions, FunctionsHttpError } from '@supabase/functions-js';
import { LoggerService } from '../logger/logger.service';

@Service({ autoProvided: false })
export class SupabaseEdgeFunctionService {
  readonly #supabaseClient = inject(SUPABASE_CLIENT);
  readonly #loggerService = inject(LoggerService);

  public constructor() {
    this.#loggerService.logServiceInitialization('SupabaseEdgeFunctionService');
  }

  public async invoke<T>(
    supabaseEdgeFunction: SupabaseEdgeFunction,
    functionInvokeOptions?: FunctionInvokeOptions,
  ): Promise<T> {
    const { data, error } = await this.#supabaseClient.functions.invoke<T>(
      supabaseEdgeFunction as unknown as string,
      { timeout: REQUEST_TIMEOUT_MS, ...functionInvokeOptions },
    );

    if (error) {
      throw await this.#getSupabaseEdgeFunctionError(error);
    }

    return data as T;
  }

  async #getSupabaseEdgeFunctionError(error: unknown): Promise<unknown> {
    if (!(error instanceof FunctionsHttpError)) {
      return error;
    }

    try {
      const body = await error.context.json();

      const message =
        typeof body?.error === 'string'
          ? body.error
          : typeof body?.message === 'string'
            ? body.message
            : undefined;

      return message ? new Error(message, { cause: error }) : error;
    } catch {
      return error;
    }
  }
}
