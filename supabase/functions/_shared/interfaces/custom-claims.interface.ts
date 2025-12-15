import { JwtPayload, UserAppMetadata } from '@supabase/supabase-js';

export interface CustomClaims extends JwtPayload {
  app_metadata: UserAppMetadata & { app_role_id: string };
}
