import { describe, expect, it } from 'vitest'
import { polarToPoint } from '../../lib/geometry'
import {
  createEditorState,
  editorReducer,
  getPickPreview,
  type EditorAction,
  type EditorState,
} from './editorState'

const TEXT = 'The timid dog'
const TIMID = 'token-1'
const CENTER = { x: 400, y: 350 }

const run = (actions: EditorAction[], state = createEditorState(TEXT)): EditorState =>
  actions.reduce(editorReducer, state)

const pickTimid: EditorAction[] = [
  { type: 'toggleTool' },
  { type: 'pick', tokenId: TIMID, center: CENTER, pointer: { x: 0, y: 0 } },
]

const wordAt = (state: EditorState, id: string) => state.tokens.find((t) => t.id === id)?.text

describe('editorReducer', () => {
  it('arms and disarms the picker tool', () => {
    const armed = run([{ type: 'toggleTool' }])
    expect(armed.picker.phase).toBe('armed')
    expect(run([{ type: 'toggleTool' }], armed).picker.phase).toBe('idle')
    expect(run([{ type: 'cancel' }], armed).picker.phase).toBe('idle')
  })

  it('only opens the wheel on words that have synonyms', () => {
    const state = run([
      { type: 'toggleTool' },
      { type: 'pick', tokenId: 'token-0', center: CENTER, pointer: { x: 0, y: 0 } },
    ])
    expect(state.picker.phase).toBe('armed')
  })

  it('ignores picks when the tool is not armed', () => {
    const state = run([{ type: 'pick', tokenId: TIMID, center: CENTER, pointer: { x: 0, y: 0 } }])
    expect(state.picker.phase).toBe('idle')
  })

  it('previews synonyms while dragging and commits the chosen one', () => {
    const dragged = run([...pickTimid, { type: 'drag', pointer: polarToPoint(190, 90) }])
    expect(dragged.picker.phase).toBe('open')
    if (dragged.picker.phase !== 'open') return
    expect(getPickPreview(dragged.tokens, dragged.picker).word).toBe('elated')

    const released = run([{ type: 'release' }], dragged)
    expect(released.picker.phase).toBe('releasing')
    expect(wordAt(released, TIMID)).toBe('timid')

    const committed = run([{ type: 'commit' }], released)
    expect(committed.picker.phase).toBe('closing')
    expect(wordAt(committed, TIMID)).toBe('elated')

    expect(run([{ type: 'finish' }], committed).picker.phase).toBe('idle')
  })

  it('keeps the original word when released inside the center disc', () => {
    const state = run([
      ...pickTimid,
      { type: 'drag', pointer: { x: 20, y: 10 } },
      { type: 'release' },
      { type: 'commit' },
    ])
    expect(wordAt(state, TIMID)).toBe('timid')
  })

  it('discards the selection when cancelled mid-drag', () => {
    const state = run([
      ...pickTimid,
      { type: 'drag', pointer: polarToPoint(190, -30) },
      { type: 'cancel' },
    ])
    expect(state.picker.phase).toBe('releasing')
    expect(wordAt(run([{ type: 'commit' }], state), TIMID)).toBe('timid')
  })

  it('reopens a replaced word using its original synonym table', () => {
    const replaced = run([
      ...pickTimid,
      { type: 'drag', pointer: polarToPoint(190, 90) },
      { type: 'release' },
      { type: 'commit' },
      { type: 'finish' },
    ])
    const reopened = run(
      [...pickTimid, { type: 'drag', pointer: polarToPoint(110, -30) }],
      replaced,
    )
    if (reopened.picker.phase !== 'open') throw new Error('expected the wheel to be open')
    expect(getPickPreview(reopened.tokens, reopened.picker).word).toBe('unpalatable')
  })
})
