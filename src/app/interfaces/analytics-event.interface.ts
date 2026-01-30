export interface AnalyticsEvent {
  data?: Record<string, boolean | null | number | string | undefined>;
  name: string;
}
