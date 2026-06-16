declare interface Env {
  HUSKY: string;
  NG_APP_GOOGLE_ANALYTICS_MEASUREMENT_ID: string;
  NG_APP_IS_ANALYTICS_ENABLED: string;
  NG_APP_IS_LOGGING_ENABLED: string;
  NG_APP_SUPABASE_PROJECT_URL: string;
  NG_APP_SUPABASE_PUBLISHABLE_KEY: string;
}

declare interface ImportMeta {
  readonly env: Env;
}
