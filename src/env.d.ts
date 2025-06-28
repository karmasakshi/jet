declare interface Env {
  readonly NODE_ENV: string;

  NGX_GOOGLE_ANALYTICS_MEASUREMENT_ID: string;
  NGX_IS_ANALYTICS_ENABLED: string;
  NGX_IS_LOGGING_ENABLED: string;
  NGX_SUPABASE_KEY: string;
  NGX_SUPABASE_URL: string;
}

declare interface ImportMeta {
  readonly env: Env;
}
