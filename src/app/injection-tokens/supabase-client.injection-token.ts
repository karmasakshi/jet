import { InjectionToken } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_CLIENT: InjectionToken<SupabaseClient> =
  new InjectionToken<SupabaseClient>('SUPABASE_CLIENT', {
    factory: () =>
      createClient(
        import.meta.env?.NG_APP_SUPABASE_URL ?? 'http://localhost:54321',
        import.meta.env?.NG_APP_SUPABASE_PUBLISHABLE_OR_ANON_KEY ??
          'your-supabase-publishable-or-anon-key',
        { auth: { throwOnError: true } },
      ),
    providedIn: 'root',
  });
