declare interface Env {
  readonly NG_APP_GOOGLE_ANALYTICS_MEASUREMENT_ID: string;
  readonly NG_APP_IS_ANALYTICS_ENABLED: string;
  readonly NG_APP_IS_LOGGING_ENABLED: string;
  readonly NG_APP_SUPABASE_KEY: string;
  readonly NG_APP_SUPABASE_URL: string;
}

declare interface ImportMeta {
  readonly env: Env;
}
