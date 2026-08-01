export function devLog(...args: unknown[]): void {
  if (import.meta.env.DEV) {
    console.log(...args)
  }
}

export function isMobile(): boolean {
  return window.innerWidth < 768
}

export function relativeTime(timestamp: number, now: number = Date.now()): string {
  const minutes = Math.floor(Math.max(0, now - timestamp) / 60_000)
  if (minutes < 1) return 'ahora mismo'
  if (minutes === 1) return 'hace 1 min'
  if (minutes < 60) return `hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours === 1) return 'hace 1 h'
  if (hours < 24) return `hace ${hours} h`
  const days = Math.floor(hours / 24)
  return `hace ${days} d`
}
