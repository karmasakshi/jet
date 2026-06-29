import { InjectionToken } from '@angular/core';
import { Database } from '@jet/types/database.type';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_CLIENT: InjectionToken<SupabaseClient<Database>> = new InjectionToken<
  SupabaseClient<Database>
>('SUPABASE_CLIENT', {
  factory: () =>
    createClient<Database>(
      import.meta.env.NG_APP_SUPABASE_PROJECT_URL ?? 'http://your.supabase.project.url',
      import.meta.env.NG_APP_SUPABASE_PUBLISHABLE_KEY ?? 'your-supabase-publishable-key',
      { auth: { throwOnError: true } },
    ),
  providedIn: 'root',
});
