import { AppRole } from '@jet/types/supabase/app-role.type';
import { UserAppMetadata } from '@supabase/supabase-js';

export interface CustomUserAppMetadata extends UserAppMetadata {
  app_role: AppRole | null;
}
