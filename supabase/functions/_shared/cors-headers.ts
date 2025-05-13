export const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Origin': Deno.env.get('ACCESS_CONTROL_ALLOW_ORIGIN'),
};
