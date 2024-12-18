// Define the type of the environment variables.
declare interface Env {
  readonly NG_APP_SUPABASE_KEY: string;
  readonly NG_APP_SUPABASE_URL: string;
  readonly NODE_ENV: string;
}

declare interface ImportMeta {
  readonly env: Env;
}
