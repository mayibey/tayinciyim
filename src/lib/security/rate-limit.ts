/**
 * Bellek tabanlı rate limit — tek instance / serverless'ta sınırlıdır.
 * TODO: Production — Upstash Redis veya Vercel KV ile dağıtık rate limit
 */

type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();

export interface RateLimitOptions {
  key: string;
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit({
  key,
  limit,
  windowMs,
}: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const bucket = store.get(key);

  if (!bucket || now >= bucket.resetAt) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return {
    allowed: true,
    remaining: limit - bucket.count,
    resetAt: bucket.resetAt,
  };
}

export function assertRateLimit(
  options: RateLimitOptions,
): { ok: true } | { ok: false; message: string } {
  const result = checkRateLimit(options);
  if (result.allowed) return { ok: true };
  return {
    ok: false,
    message: "Çok fazla istek gönderdiniz. Lütfen bir süre sonra tekrar deneyin.",
  };
}

/** 10 dakika penceresi */
export const RATE_WINDOWS = {
  tenMinutes: 10 * 60 * 1000,
} as const;

export const RATE_LIMITS = {
  createListing: { limit: 5, windowMs: RATE_WINDOWS.tenMinutes },
  reportListing: { limit: 10, windowMs: RATE_WINDOWS.tenMinutes },
  auth: { limit: 10, windowMs: RATE_WINDOWS.tenMinutes },
} as const;
