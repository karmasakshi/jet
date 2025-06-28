declare interface Env {
  readonly NODE_ENV: string;

  NG_APP_GOOGLE_ANALYTICS_MEASUREMENT_ID: string;
  NG_APP_IS_ANALYTICS_ENABLED: string;
  NG_APP_IS_LOGGING_ENABLED: string;
  NG_APP_SUPABASE_KEY: string;
  NG_APP_SUPABASE_URL: string;
}

declare interface ImportMeta {
  readonly env: Env;
}
