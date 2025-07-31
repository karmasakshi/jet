import { inject, Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { LoggerService } from '../logger/logger.service';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private readonly _loggerService = inject(LoggerService);

  private readonly _supabaseClient: SupabaseClient;

  public constructor() {
    this._supabaseClient = createClient(
      import.meta.env.NG_APP_SUPABASE_URL,
      import.meta.env.NG_APP_SUPABASE_ANON_KEY,
    );

    this._loggerService.logServiceInitialization('SupabaseService');
  }

  public get supabaseClient(): SupabaseClient {
    return this._supabaseClient;
  }
}
