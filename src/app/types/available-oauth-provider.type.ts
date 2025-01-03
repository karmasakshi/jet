import { Provider } from '@supabase/supabase-js';

export type AvailableOauthProvider = Extract<Provider, 'facebook' | 'google'>;
