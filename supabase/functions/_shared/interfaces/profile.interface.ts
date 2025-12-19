import { User } from '@supabase/supabase-js';

export interface Profile {
  avatar_url: null | string;
  created_at: string;
  full_name: null | string;
  updated_at: null | string;
  user_id: User['id'];
  username: string;
}
