import { User } from '@supabase/supabase-js';
import { CustomError } from '../classes/custom-error.class.ts';
import { upstashRatelimitClient } from '../clients/upstash-ratelimit.client.ts';
import { CustomErrorMessage } from '../enums/custom-error-message.enum.ts';

export async function checkIsBelowRateLimit(userId: User['id']): Promise<void> {
  const { success } = await upstashRatelimitClient.limit(userId);

  if (!success) {
    throw new CustomError(429, CustomErrorMessage.TooManyRequests);
  }
}
