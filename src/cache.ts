export const CACHE_TTL_MS = 24 * 60 * 60 * 1000

export interface CacheEntry<T> {
  timestamp: number
  data: T
}

export function loadCache<T>(key: string): CacheEntry<T> | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const entry = JSON.parse(raw) as CacheEntry<T>
    if (typeof entry.timestamp !== 'number' || !('data' in entry)) return null
    return entry
  } catch {
    return null
  }
}

export function saveCache<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = { timestamp: Date.now(), data }
    localStorage.setItem(key, JSON.stringify(entry))
  } catch (err) {
    console.warn('Failed to save Overpass cache:', err)
  }
}

export function isFresh(entry: CacheEntry<unknown>): boolean {
  return Date.now() - entry.timestamp < CACHE_TTL_MS
}

export function hashString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  }
  return hash.toString(36)
}
