import { User } from '@supabase/supabase-js';
import { JetError } from '../classes/jet-error.class.ts';
import { upstashRatelimitClient } from '../clients/upstash-ratelimit.client.ts';
import { JET_ERROR_MESSAGES } from '../constants/jet-error-messages.constant.ts';

export async function checkIsBelowRateLimit(userId: User['id']): Promise<void> {
  const { success } = await upstashRatelimitClient.limit(userId);

  if (!success) {
    throw new JetError(429, JET_ERROR_MESSAGES.TOO_MANY_REQUESTS);
  }
}
