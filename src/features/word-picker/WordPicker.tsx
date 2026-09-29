import { useEffect, useReducer, useRef, useState, type PointerEvent } from 'react'
import { Stage } from '../../components/Stage/Stage'
import { Toolbar } from '../../components/Toolbar/Toolbar'
import { STAGE_HEIGHT, STAGE_WIDTH } from '../../config/stage'
import { TIMING } from '../../config/timing'
import { useFitScale } from '../../hooks/useFitScale'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { useTypewriter } from '../../hooks/useTypewriter'
import { ms, type CSSVariables } from '../../lib/cssVariables'
import { subtractPoints } from '../../lib/geometry'
import { clientToStage, elementCenterInStage } from '../../lib/stageCoordinates'
import { textLength } from '../../lib/tokens'
import { Editor } from './Editor/Editor'
import { EmotionWheel } from './EmotionWheel/EmotionWheel'
import { WHEEL_GEOMETRY } from './EmotionWheel/wheelModel'
import { createEditorState, editorReducer, getPickPreview } from './editorState'
import { pickerCursor } from './pickerCursor'

export const INITIAL_TEXT = 'The timid dog jumped at the thundering sound'

const MOTION_VARIABLES: CSSVariables = {
  '--dim-in-duration': ms(TIMING.dimInMs),
  '--wheel-fade-in-duration': ms(TIMING.wheelFadeInMs),
  '--fade-out-duration': ms(TIMING.fadeOutMs),
}

export function WordPicker() {
  const [{ tokens, picker }, dispatch] = useReducer(editorReducer, INITIAL_TEXT, createEditorState)
  const stageRef = useRef<HTMLDivElement>(null)
  const stageScale = useFitScale(STAGE_WIDTH, STAGE_HEIGHT)
  const reducedMotion = usePrefersReducedMotion()

  const [introLength] = useState(() => textLength(tokens))
  const visibleChars = useTypewriter(introLength, {
    charIntervalMs: TIMING.typewriterCharMs,
    startDelayMs: TIMING.typewriterStartDelayMs,
    enabled: !reducedMotion,
  })
  const introDone = visibleChars >= introLength
  // Once typed in, the text stays fully visible even as replacements change its length.
  const revealedChars = introDone ? Number.POSITIVE_INFINITY : visibleChars

  const { phase } = picker
  const pick = picker.phase === 'idle' || picker.phase === 'armed' ? null : picker
  const preview = pick ? getPickPreview(tokens, pick) : null
  const toolActive = phase === 'armed' || phase === 'open'
  const wheelShowing = phase === 'open' || phase === 'releasing'
  const openCenter = picker.phase === 'open' ? picker.center : null

  // Follow the pointer anywhere on the page while the wheel is open.
  useEffect(() => {
    const stage = stageRef.current
    if (!openCenter || !stage) return

    const pointerFrom = (event: globalThis.PointerEvent) =>
      subtractPoints(clientToStage(stage, event.clientX, event.clientY), openCenter)
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
    const stage = stageRef.current
    if (!stage || !event.isPrimary) return
    event.preventDefault()

    const wordCenter = elementCenterInStage(stage, word)
    const center = { x: wordCenter.x, y: wordCenter.y + WHEEL_GEOMETRY.wordCenterOffsetY }
    const pointer = subtractPoints(clientToStage(stage, event.clientX, event.clientY), center)
    dispatch({ type: 'pick', tokenId, center, pointer })
  }

  return (
    <Stage
      ref={stageRef}
      dimmed={wheelShowing}
      cursor={toolActive ? pickerCursor(stageScale) : null}
      style={MOTION_VARIABLES}
    >
      <Toolbar
        pickerActive={toolActive}
        onTogglePicker={() => dispatch({ type: 'toggleTool' })}
        dimmed={wheelShowing}
      />
      <Editor
        tokens={tokens}
        visibleChars={revealedChars}
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
      <p className="visually-hidden" aria-live="polite">
        {wheelShowing && preview ? preview.word : ''}
      </p>
    </Stage>
  )
}
