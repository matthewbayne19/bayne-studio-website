/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * NOTE: this state lives in the memory of a single serverless instance, so
 * on Vercel it only throttles a burst against one warm instance — it will
 * NOT stop a determined, distributed attacker (they'd just spread requests
 * across cold starts). That's an acceptable tradeoff for a low-traffic
 * sales-demo site today: it stops casual/naive scripts and accidental
 * loops from burning v0 API credits. If this ever needs to hold up against
 * real abuse, swap this for Vercel's Firewall rate limiting or an
 * Upstash Redis-backed limiter (@upstash/ratelimit) so the count is shared
 * across instances.
 */

const WINDOW_MS = 60_000
const MAX_REQUESTS_PER_WINDOW = 30

type Bucket = { count: number; windowStart: number }

const buckets = new Map<string, Bucket>()

// Prevent unbounded memory growth from an attacker cycling through IPs/keys.
const MAX_TRACKED_KEYS = 5000

export function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const existing = buckets.get(key)

  if (!existing || now - existing.windowStart > WINDOW_MS) {
    if (buckets.size >= MAX_TRACKED_KEYS) buckets.clear()
    buckets.set(key, { count: 1, windowStart: now })
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 }
  }

  if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 }
  }

  existing.count++
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - existing.count }
}

export function getClientKey(request: Request): string {
  // Vercel sets x-forwarded-for; fall back to a constant so local dev
  // (where the header is absent) still shares one bucket instead of
  // throwing.
  const forwardedFor = request.headers.get("x-forwarded-for")
  return forwardedFor?.split(",")[0]?.trim() ?? "unknown"
}
