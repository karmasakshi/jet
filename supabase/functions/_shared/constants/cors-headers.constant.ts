export const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Headers':
    'apikey, authorization, content-type, x-client-info',
  'Access-Control-Allow-Origin': Deno.env.get('ACCESS_CONTROL_ALLOW_ORIGIN')!,
};
