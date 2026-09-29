import type { CSSProperties } from 'react'

/** Inline styles that may also set CSS custom properties. */
export type CSSVariables = CSSProperties & { [variable: `--${string}`]: string | number }

/** Converts a millisecond duration to a CSS time value. */
export function ms(duration: number): string {
  return `${duration}ms`
}
