import { User } from '@supabase/supabase-js';

export interface Profile {
  id: User['id'];
  avatar_url: string | null;
  username: string;
  created_at: string;
  updated_at: string;
}
