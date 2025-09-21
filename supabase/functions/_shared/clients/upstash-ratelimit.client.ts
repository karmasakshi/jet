import { Ratelimit } from '@upstash/ratelimit';
import { upstashRedisClient } from './upstash-redis.client.ts';

export const upstashRatelimitClient: Ratelimit = new Ratelimit({
  analytics: true,
  limiter: Ratelimit.slidingWindow(10, '1 h'),
  redis: upstashRedisClient,
});
