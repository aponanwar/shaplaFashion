// lib/rateLimit.ts
// In-memory rate limiter (works for single-instance; upgrade to Redis for multi-instance)
// Protects API routes from abuse

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  store.forEach((entry, key) => {
    if (entry.resetAt < now) store.delete(key);
  });
}, 5 * 60 * 1000);

interface RateLimitConfig {
  windowMs?: number;  // default 60s
  max?: number;       // default 100 req/window
}

export function rateLimit(ip: string, config: RateLimitConfig = {}): {
  success: boolean;
  remaining: number;
  resetAt: number;
} {
  const windowMs = config.windowMs ?? Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
  const max = config.max ?? Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? 100);
  const now = Date.now();

  const entry = store.get(ip);

  if (!entry || entry.resetAt < now) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: max - 1, resetAt: now + windowMs };
  }

  if (entry.count >= max) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { success: true, remaining: max - entry.count, resetAt: entry.resetAt };
}

// Stricter limit for auth endpoints
export function authRateLimit(ip: string) {
  return rateLimit(ip, { windowMs: 15 * 60 * 1000, max: 10 });
}
