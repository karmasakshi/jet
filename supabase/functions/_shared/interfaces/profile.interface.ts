import { User } from '@supabase/supabase-js';
import { AppRole } from '../enums/app-role.enum.ts';

export interface Profile {
  app_role: AppRole;
  avatar_url: null | string;
  created_at: string;
  full_name: null | string;
  updated_at: string;
  user_id: User['id'];
  username: string;
}
