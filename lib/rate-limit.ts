type Bucket = { count: number; reset: number };

const hits = new Map<string, Bucket>();

export function rateLimit(key: string, limit = 8, windowMs = 60_000): boolean {
  const now = Date.now();
  const bucket = hits.get(key);
  if (!bucket || bucket.reset < now) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}
