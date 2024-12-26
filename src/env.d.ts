declare interface Env {
  readonly NG_APP_IS_ANALYTICS_ENABLED: string;
  readonly NG_APP_IS_LOGGING_ENABLED: string;
  readonly NG_APP_SUPABASE_IS_CONFIRM_EMAIL_ON: string;
  readonly NG_APP_SUPABASE_KEY: string;
  readonly NG_APP_SUPABASE_URL: string;
  readonly NODE_ENV: string;
}

declare interface ImportMeta {
  readonly env: Env;
}
