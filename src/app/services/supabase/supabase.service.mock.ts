import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class SupabaseService {
  private readonly _supabaseClient: SupabaseClient;

  public constructor() {
    this._supabaseClient = createClient(
      import.meta.env.NG_APP_SUPABASE_URL,
      import.meta.env.NG_APP_SUPABASE_KEY,
    );
  }

  public get supabaseClient(): SupabaseClient {
    return this._supabaseClient;
  }
}
