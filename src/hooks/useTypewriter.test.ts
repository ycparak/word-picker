import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTypewriter } from './useTypewriter'

const OPTIONS = { charIntervalMs: 40, maxDurationMs: 2400, startDelayMs: 300, enabled: true }

describe('useTypewriter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('reveals one character per interval after the start delay', () => {
    const { result } = renderHook(() => useTypewriter(5, OPTIONS))
    expect(result.current).toBe(0)

    act(() => vi.advanceTimersByTime(300 + 40 * 2))
    expect(result.current).toBe(2)

    act(() => vi.advanceTimersByTime(40 * 10))
    expect(result.current).toBe(5)
  })

  it('speeds up long text so the intro fits the maximum duration', () => {
    const { result } = renderHook(() => useTypewriter(600, OPTIONS))

    act(() => vi.advanceTimersByTime(300 + 1200))
    expect(result.current).toBeGreaterThan(250)
    expect(result.current).toBeLessThan(350)

    act(() => vi.advanceTimersByTime(1200 + 50))
    expect(result.current).toBe(600)
  })

  it('shows everything immediately when disabled', () => {
    const { result } = renderHook(() => useTypewriter(5, { ...OPTIONS, enabled: false }))
    expect(result.current).toBe(5)
  })
})
