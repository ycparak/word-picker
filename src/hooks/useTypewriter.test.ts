import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTypewriter } from './useTypewriter'

describe('useTypewriter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('reveals one character per interval after the start delay', () => {
    const { result } = renderHook(() =>
      useTypewriter(5, { charIntervalMs: 40, startDelayMs: 300, enabled: true }),
    )
    expect(result.current).toBe(0)

    act(() => vi.advanceTimersByTime(300 + 40 * 2))
    expect(result.current).toBe(2)

    act(() => vi.advanceTimersByTime(40 * 10))
    expect(result.current).toBe(5)
  })

  it('shows everything immediately when disabled', () => {
    const { result } = renderHook(() =>
      useTypewriter(5, { charIntervalMs: 40, startDelayMs: 300, enabled: false }),
    )
    expect(result.current).toBe(5)
  })
})
