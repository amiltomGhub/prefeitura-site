/**
 * In-memory TTL cache — substitui Redis quando REDIS_URL não está disponível.
 * Thread-safe para uso single-process (Node.js).
 */

interface CacheEntry {
  value: unknown;
  expiresAt: number;
}

const store = new Map<string, CacheEntry>();

// Limpeza periódica a cada 5 minutos
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.expiresAt) store.delete(key);
  }
}, 5 * 60 * 1000).unref();

export function cacheGet<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value as T;
}

export function cacheSet(key: string, value: unknown, ttlMs: number): void {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export function cacheDel(key: string): void {
  store.delete(key);
}

export function cacheDelPattern(prefix: string): void {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}

/** Decorator helper: busca no cache, se miss executa fn e armazena resultado */
export async function withCache<T>(
  key: string,
  ttlMs: number,
  fn: () => Promise<T>,
): Promise<T> {
  const cached = cacheGet<T>(key);
  if (cached !== null) return cached;
  const result = await fn();
  cacheSet(key, result, ttlMs);
  return result;
}
