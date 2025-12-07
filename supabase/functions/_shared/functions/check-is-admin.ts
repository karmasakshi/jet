import { SupabaseClient, User } from '@supabase/supabase-js';
import { JetError } from '../classes/jet-error.class.ts';
import { JET_ERROR_MESSAGES } from '../constants/jet-error-messages.constant.ts';
import { Profile } from '../interfaces/profile.interface.ts';
import { selectProfile } from './select-profile.ts';

export async function checkIsAdmin(
  userId: User['id'],
  supabaseClient: SupabaseClient,
): Promise<void> {
  const profile: Profile = await selectProfile(userId, supabaseClient);

  if (profile.app_role !== 'admin') {
    throw new JetError(403, JET_ERROR_MESSAGES.FORBIDDEN);
  }
}
