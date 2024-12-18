import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class SupabaseService {
  private readonly _supabaseClient: SupabaseClient;

  public constructor() {
    this._supabaseClient = createClient('', '');
  }

  public get supabaseClient(): SupabaseClient {
    return this._supabaseClient;
  }
}
