import { SupabaseClient, User } from '@supabase/supabase-js';
import { Profile } from '../interfaces/profile.interface.ts';

export async function selectProfile(
  userId: User['id'],
  supabaseClient: SupabaseClient,
): Promise<Profile> {
  const { data } = await supabaseClient
    .from('profiles')
    .select()
    .eq('user_id', userId)
    .single()
    .throwOnError();

  return data;
}
