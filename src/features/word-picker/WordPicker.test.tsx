import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TIMING } from '../../config/timing'
import { INITIAL_TEXT, WordPicker } from './WordPicker'

const finishIntro = () =>
  act(() => {
    vi.advanceTimersByTime(
      TIMING.typewriterStartDelayMs + TIMING.typewriterCharMs * (INITIAL_TEXT.length + 1),
    )
  })

/** The sentence is split across word spans, so match on the paragraph's full text. */
const getSentence = (text: string) =>
  screen.getByText((_, element) => element?.tagName === 'P' && element.textContent === text)

describe('WordPicker', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('types the sentence in', () => {
    render(<WordPicker />)
    finishIntro()
    expect(getSentence(INITIAL_TEXT)).toBeInTheDocument()
  })

  it('toggles the picker tool from the toolbar', () => {
    render(<WordPicker />)
    const picker = screen.getByRole('button', { name: 'Emotion word picker' })
    expect(picker).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(picker)
    expect(picker).toHaveAttribute('aria-pressed', 'true')

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(picker).toHaveAttribute('aria-pressed', 'false')
  })

  it('replaces a word with the synonym chosen on the wheel', () => {
    render(<WordPicker />)
    finishIntro()
    fireEvent.click(screen.getByRole('button', { name: 'Emotion word picker' }))

    // jsdom has no layout: every rect is empty, so stage and client coordinates coincide
    // and the wheel opens at the origin.
    fireEvent.pointerDown(screen.getByText('timid'), { isPrimary: true, clientX: 0, clientY: 0 })
    fireEvent.pointerMove(window, { clientX: 0, clientY: 195 })
    expect(screen.getAllByText('elated')).not.toHaveLength(0)

    fireEvent.pointerUp(window, { clientX: 0, clientY: 195 })
    act(() => {
      vi.advanceTimersByTime(TIMING.releaseHoldMs + TIMING.fadeOutMs)
    })

    expect(getSentence('The elated dog jumped at the thundering sound')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Emotion word picker' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })
})
