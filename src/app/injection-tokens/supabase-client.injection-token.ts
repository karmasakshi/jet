import { InjectionToken } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_CLIENT: InjectionToken<SupabaseClient> = new InjectionToken<SupabaseClient>(
  'SUPABASE_CLIENT',
  {
    factory: () =>
      createClient(
        import.meta.env.VITE_SUPABASE_PROJECT_URL,
        import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        { auth: { throwOnError: true } },
      ),
    providedIn: 'root',
  },
);
