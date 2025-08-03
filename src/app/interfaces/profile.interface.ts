import { User } from '@supabase/supabase-js';

export interface Profile {
  avatar_url: null | string;
  created_at: string;
  id: User['id'];
  updated_at: string;
  username: string;
}
