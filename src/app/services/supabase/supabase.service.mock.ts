import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseServiceMock {
  public get supabaseClient(): SupabaseClient {
    return {} as SupabaseClient;
  }
}
