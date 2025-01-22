import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseServiceMock {
  public get supabaseClient(): SupabaseClient {
    return {
      auth: {
        onAuthStateChange: (() => undefined) as unknown,
      },
      from: (() => ({
        select: () => ({
          order: () => ({
            throwOnError: () => Promise.resolve(),
          }),
        }),
      })) as unknown,
    } as SupabaseClient;
  }
}
