import { RequiredClaims } from '@supabase/supabase-js';
import { AppRole } from '../enums/app-role.enum.ts';

export interface CustomClaims extends RequiredClaims {
  app_metadata: { app_role: AppRole };
}
