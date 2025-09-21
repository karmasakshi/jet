import { SupabaseClient, User } from '@supabase/supabase-js';
import { CustomError } from '../classes/custom-error.class.ts';
import { CustomErrorMessage } from '../enums/custom-error-message.enum.ts';
import { Profile } from '../interfaces/profile.interface.ts';
import { selectProfile } from './select-profile.ts';

export async function checkIsAdmin(
  userId: User['id'],
  supabaseClient: SupabaseClient,
): Promise<void> {
  const profile: Profile = await selectProfile(userId, supabaseClient);

  if (profile.app_role !== 'admin') {
    throw new CustomError(403, CustomErrorMessage.Forbidden);
  }
}
