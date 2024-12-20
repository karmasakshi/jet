import { Provider } from '@supabase/supabase-js';

export type AvailableOauthProviders = Extract<Provider, 'google'>;
