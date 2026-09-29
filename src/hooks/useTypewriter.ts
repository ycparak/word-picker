import { useEffect, useState } from 'react'

interface TypewriterOptions {
  charIntervalMs: number
  startDelayMs: number
  /** When false, everything is visible immediately. */
  enabled: boolean
}

/** Returns how many of `length` characters have been "typed" so far. */
export function useTypewriter(
  length: number,
  { charIntervalMs, startDelayMs, enabled }: TypewriterOptions,
): number {
  const [typed, setTyped] = useState(0)

  useEffect(() => {
    if (!enabled) return

    let count = 0
    let intervalId: number | undefined
    const startId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        count += 1
        setTyped(count)
        if (count >= length) window.clearInterval(intervalId)
      }, charIntervalMs)
    }, startDelayMs)

    return () => {
      window.clearTimeout(startId)
      window.clearInterval(intervalId)
    }
  }, [length, charIntervalMs, startDelayMs, enabled])

  return enabled ? Math.min(typed, length) : length
}
