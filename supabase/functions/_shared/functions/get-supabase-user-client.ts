import { createClient, SupabaseClient } from '@supabase/supabase-js';

export function getSupabaseUserClient(
  authorizationHeader: string,
): SupabaseClient {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
      global: { headers: { Authorization: authorizationHeader } },
    },
  );
}
