import { inject, Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { LoggerService } from '../logger/logger.service';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly #loggerService = inject(LoggerService);

  readonly #supabaseClient: SupabaseClient;

  public constructor() {
    this.#supabaseClient = createClient(
      import.meta.env.NG_APP_SUPABASE_URL,
      import.meta.env.NG_APP_SUPABASE_PUBLISHABLE_OR_ANON_KEY,
    );

    this.#loggerService.logServiceInitialization('SupabaseService');
  }

  public get supabaseClient(): SupabaseClient {
    return this.#supabaseClient;
  }
}
