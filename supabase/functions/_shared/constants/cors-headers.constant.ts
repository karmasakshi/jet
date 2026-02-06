import { corsHeaders } from '@supabase/supabase-js/cors';

export const CORS_HEADERS: Record<string, string> = {
  ...corsHeaders,
  'Access-Control-Allow-Origin': Deno.env.get('ACCESS_CONTROL_ALLOW_ORIGIN')!,
};
