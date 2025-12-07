import { Provider } from '@supabase/supabase-js';

export type OauthProvider = Extract<Provider, 'google'>;
