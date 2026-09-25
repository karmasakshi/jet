/* eslint-disable @typescript-eslint/no-unused-vars */

import { SupabaseEdgeFunction } from '@jet/enums/supabase-edge-function.enum';
import { FunctionInvokeOptions } from '@supabase/functions-js';

export class SupabaseEdgeFunctionServiceMock {
  public async invoke<T>(
    _supabaseEdgeFunction: SupabaseEdgeFunction,
    _functionInvokeOptions?: FunctionInvokeOptions,
  ): Promise<T> {
    return Promise.resolve({} as T);
  }
}
