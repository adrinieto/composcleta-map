export function devLog(...args: unknown[]): void {
  if (import.meta.env.DEV) {
    console.log(...args)
  }
}

export function isMobile(): boolean {
  return window.innerWidth < 768
}
