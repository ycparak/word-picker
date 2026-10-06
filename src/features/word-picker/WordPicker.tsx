import { useEffect, useReducer, useRef, useState, type PointerEvent } from 'react'
import { Headline } from '../../components/Headline/Headline'
import { Page } from '../../components/Page/Page'
import { Toolbar } from '../../components/Toolbar/Toolbar'
import { TIMING } from '../../config/timing'
import type { DocumentTitle } from '../../data/document'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { useTypewriter } from '../../hooks/useTypewriter'
import { clientToLocal, elementCenterIn } from '../../lib/coordinates'
import { ms, type CSSVariables } from '../../lib/cssVariables'
import { subtractPoints } from '../../lib/geometry'
import { textLength } from '../../lib/tokens'
import { Editor } from './Editor/Editor'
import { EmotionWheel } from './EmotionWheel/EmotionWheel'
import { createEditorState, editorReducer, getPickPreview } from './editorState'
import { PICKER_CURSOR } from './pickerCursor'
import styles from './WordPicker.module.css'

const MOTION_VARIABLES: CSSVariables = {
  '--dim-in-duration': ms(TIMING.dimInMs),
  '--wheel-fade-in-duration': ms(TIMING.wheelFadeInMs),
  '--fade-out-duration': ms(TIMING.fadeOutMs),
  '--reveal-duration': ms(TIMING.restRevealMs),
}

interface WordPickerProps {
  title: DocumentTitle
  /** Initial body text, one string per paragraph. */
  paragraphs: readonly string[]
}

export function WordPicker({ title, paragraphs: initialParagraphs }: WordPickerProps) {
  const [{ paragraphs, picker }, dispatch] = useReducer(
    editorReducer,
    initialParagraphs,
    createEditorState,
  )
  const documentRef = useRef<HTMLElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  // The intro types out the first paragraph; the rest fades in once it's done.
  const [introLength] = useState(() => textLength(paragraphs[0] ?? []))
  const visibleChars = useTypewriter(introLength, {
    charIntervalMs: TIMING.typewriterCharMs,
    maxDurationMs: TIMING.typewriterMaxDurationMs,
    startDelayMs: TIMING.typewriterStartDelayMs,
    enabled: !reducedMotion,
  })
  const introDone = visibleChars >= introLength
  // Once typed in, the text stays fully visible even as replacements change its length.
  const typedChars = introDone ? Number.POSITIVE_INFINITY : visibleChars

  const { phase } = picker
  const pick = picker.phase === 'idle' || picker.phase === 'armed' ? null : picker
  const preview = pick ? getPickPreview(paragraphs, pick) : null
  const toolActive = phase === 'armed' || phase === 'open'
  const wheelShowing = phase === 'open' || phase === 'releasing'
  const openCenter = picker.phase === 'open' ? picker.center : null

  // Follow the pointer anywhere on the page while the wheel is open. Positions are measured
  // against the document on every event, so scrolling mid-drag doesn't throw them off.
  useEffect(() => {
    const documentElement = documentRef.current
    if (!openCenter || !documentElement) return

    const pointerFrom = (event: globalThis.PointerEvent) =>
      subtractPoints(clientToLocal(documentElement, event.clientX, event.clientY), openCenter)
    const handleMove = (event: globalThis.PointerEvent) =>
      dispatch({ type: 'drag', pointer: pointerFrom(event) })
    const handleUp = (event: globalThis.PointerEvent) => {
      dispatch({ type: 'drag', pointer: pointerFrom(event) })
      dispatch({ type: 'release' })
    }
    const handleCancel = () => dispatch({ type: 'cancel' })

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    window.addEventListener('pointercancel', handleCancel)
    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('pointercancel', handleCancel)
    }
  }, [openCenter])

  // Hold on the chosen word briefly, commit it, then let the wheel fade out.
  useEffect(() => {
    const next =
      phase === 'releasing'
        ? { action: 'commit' as const, delay: TIMING.releaseHoldMs }
        : phase === 'closing'
          ? { action: 'finish' as const, delay: TIMING.fadeOutMs }
          : null
    if (!next) return

    const timeoutId = window.setTimeout(() => dispatch({ type: next.action }), next.delay)
    return () => window.clearTimeout(timeoutId)
  }, [phase])

  useEffect(() => {
    if (!toolActive) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dispatch({ type: 'cancel' })
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toolActive])

  const handlePickWord = (tokenId: string, word: HTMLElement, event: PointerEvent) => {
    const documentElement = documentRef.current
    if (!documentElement || !event.isPrimary) return
    event.preventDefault()

    const center = elementCenterIn(documentElement, word)
    const pointer = subtractPoints(
      clientToLocal(documentElement, event.clientX, event.clientY),
      center,
    )
    dispatch({ type: 'pick', tokenId, center, pointer })
  }

  return (
    <Page dimmed={wheelShowing} cursor={toolActive ? PICKER_CURSOR : null} style={MOTION_VARIABLES}>
      <Toolbar
        pickerActive={toolActive}
        onTogglePicker={() => dispatch({ type: 'toggleTool' })}
        dimmed={wheelShowing}
      />
      <main className={styles.main}>
        <article ref={documentRef} className={styles.document}>
          <header className={styles.header} data-dimmed={wheelShowing || undefined}>
            <Headline lead={title.lead} accent={title.accent} />
          </header>
          <Editor
            paragraphs={paragraphs}
            typedChars={typedChars}
            revealRest={introDone}
            pickable={phase === 'armed' && introDone}
            dimmed={wheelShowing}
            activeTokenId={pick?.tokenId ?? null}
            hideActive={wheelShowing}
            onPickWord={handlePickWord}
          />
          {pick && preview && (
            <EmotionWheel
              center={pick.center}
              selection={preview.selection}
              word={wheelShowing ? preview.word : null}
              closing={phase === 'closing'}
            />
          )}
        </article>
      </main>
      <p className="visually-hidden" aria-live="polite">
        {wheelShowing && preview ? preview.word : ''}
      </p>
    </Page>
  )
}
