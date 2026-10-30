import { InjectionToken } from '@angular/core';
import { REQUEST_TIMEOUT_MS } from '@jet/constants/request-timeout-ms.constant';
import { Database } from '@jet/types/supabase/database.type';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_CLIENT = new InjectionToken<SupabaseClient<Database>>('SUPABASE_CLIENT', {
  factory: () =>
    createClient<Database>(
      import.meta.env.NG_APP_SUPABASE_PROJECT_URL,
      import.meta.env.NG_APP_SUPABASE_PUBLISHABLE_KEY,
      {
        auth: { debug: import.meta.env.NG_APP_IS_LOGGING_ENABLED === 'true', throwOnError: true },
        db: { timeout: REQUEST_TIMEOUT_MS },
      },
    ),
});
