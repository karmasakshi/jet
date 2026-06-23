// https://vite.dev/guide/env-and-mode

interface ImportMetaEnv {
  readonly HUSKY: string;
  readonly VITE_GOOGLE_ANALYTICS_MEASUREMENT_ID: string;
  readonly VITE_IS_ANALYTICS_ENABLED: string;
  readonly VITE_IS_LOGGING_ENABLED: string;
  readonly VITE_SUPABASE_PROJECT_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
