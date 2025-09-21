import { Redis } from '@upstash/redis';

export const upstashRedisClient: Redis = new Redis({
  token: Deno.env.get('UPSTASH_REDIS_REST_TOKEN'),
  url: Deno.env.get('UPSTASH_REDIS_REST_URL'),
});
