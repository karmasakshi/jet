import { CORS_HEADERS } from './cors-headers.constant.ts';

export const COMMON_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  ...CORS_HEADERS,
};
