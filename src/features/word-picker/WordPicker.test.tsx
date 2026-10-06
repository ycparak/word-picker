import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TIMING } from '../../config/timing'
import { WordPicker } from './WordPicker'

const TITLE = { lead: 'prototyping a', accent: 'word picker' }
const FIRST = 'It was the season of Light, it was the season of Darkness.'
const SECOND = 'There were a king with a large jaw and a queen with a plain face.'

const renderPicker = () => render(<WordPicker title={TITLE} paragraphs={[FIRST, SECOND]} />)

const finishIntro = () =>
  act(() => {
    vi.advanceTimersByTime(TIMING.typewriterStartDelayMs + TIMING.typewriterMaxDurationMs + 100)
  })

/** The text is split across word spans, so match on the paragraph's full text. */
const getParagraph = (text: string) =>
  screen.getByText((_, element) => element?.tagName === 'P' && element.textContent === text)

describe('WordPicker', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows the title and types the first paragraph in', () => {
    renderPicker()
    expect(screen.getByRole('heading', { name: 'prototyping a word picker' })).toBeInTheDocument()

    finishIntro()
    expect(getParagraph(FIRST)).toBeInTheDocument()
  })

  it('reveals the remaining paragraphs once the intro has finished', () => {
    renderPicker()
    expect(getParagraph(SECOND)).toHaveAttribute('data-pending')

    finishIntro()
    expect(getParagraph(SECOND)).not.toHaveAttribute('data-pending')
  })

  it('toggles the picker tool from the toolbar', () => {
    renderPicker()
    const picker = screen.getByRole('button', { name: 'Emotion word picker' })
    expect(picker).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(picker)
    expect(picker).toHaveAttribute('aria-pressed', 'true')

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(picker).toHaveAttribute('aria-pressed', 'false')
  })

  it('replaces a word with the synonym chosen on the wheel', () => {
    renderPicker()
    finishIntro()
    fireEvent.click(screen.getByRole('button', { name: 'Emotion word picker' }))

    // jsdom has no layout: every rect is empty, so the wheel opens at the origin and pointer
    // coordinates are offsets from it. 140px straight down is joy's strongest band.
    fireEvent.pointerDown(screen.getByText('Light'), { isPrimary: true, clientX: 0, clientY: 0 })
    fireEvent.pointerMove(window, { clientX: 0, clientY: 140 })
    expect(screen.getAllByText('Splendor')).not.toHaveLength(0)

    fireEvent.pointerUp(window, { clientX: 0, clientY: 140 })
    act(() => {
      vi.advanceTimersByTime(TIMING.releaseHoldMs + TIMING.fadeOutMs)
    })

    expect(
      getParagraph('It was the season of Splendor, it was the season of Darkness.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Emotion word picker' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })
})
