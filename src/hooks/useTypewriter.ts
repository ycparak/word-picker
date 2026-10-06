import { useEffect, useState } from 'react'

interface TypewriterOptions {
  /** Time per character. */
  charIntervalMs: number
  /** Upper bound on the whole intro; long text types faster to fit. */
  maxDurationMs: number
  startDelayMs: number
  /** When false, everything is visible immediately. */
  enabled: boolean
}

/** Roughly one display frame: characters are revealed in batches when they come faster. */
const MIN_TICK_MS = 16

/** Returns how many of `length` characters have been "typed" so far. */
export function useTypewriter(
  length: number,
  { charIntervalMs, maxDurationMs, startDelayMs, enabled }: TypewriterOptions,
): number {
  const [typed, setTyped] = useState(0)

  useEffect(() => {
    if (!enabled || length === 0) return

    const interval = Math.min(charIntervalMs, maxDurationMs / length)
    let tickId: number | undefined
    const startId = window.setTimeout(() => {
      const startedAt = Date.now()
      tickId = window.setInterval(
        () => {
          const count = Math.min(length, Math.floor((Date.now() - startedAt) / interval))
          setTyped(count)
          if (count >= length) window.clearInterval(tickId)
        },
        Math.max(interval, MIN_TICK_MS),
      )
    }, startDelayMs)

    return () => {
      window.clearTimeout(startId)
      window.clearInterval(tickId)
    }
  }, [length, charIntervalMs, maxDurationMs, startDelayMs, enabled])

  return enabled ? Math.min(typed, length) : length
}
