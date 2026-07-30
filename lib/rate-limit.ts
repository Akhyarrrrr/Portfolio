// ponytail: in-memory fixed-window limiter, scoped to a single server
// instance. Good enough for a portfolio's traffic — no Redis, no new
// paid service, stays on Vercel's free tier. Ceiling: on serverless,
// each cold start gets its own empty Map, so a determined attacker
// spread across enough invocations could evade it. Upgrade to Upstash
// Redis (free tier exists) if abuse actually shows up in logs.

type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Entry>();

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Returns true if the request should be allowed, false if rate-limited.
 * `key` should already include a namespace (e.g. "send-email:203.0.113.1")
 * so different routes don't share a counter.
 */
export function checkRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): boolean {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now >= entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count++;
  return true;
}
