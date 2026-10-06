import { describe, expect, it } from 'vitest'
import { polarToPoint } from '../../lib/geometry'
import { findToken } from '../../lib/tokens'
import {
  createEditorState,
  editorReducer,
  getPickPreview,
  type EditorAction,
  type EditorState,
} from './editorState'

const TEXT = 'It was the season of Light, it was the best of times.'
const IT = 'token-0'
const LIGHT = 'token-5'
const BEST = 'token-9'
const CENTER = { x: 280, y: 120 }

// Pointer offsets from the wheel center (see WHEEL_GEOMETRY for the bands).
const JOY_STRONGEST = polarToPoint(140, 90)
const DISGUST_MILDEST = polarToPoint(70, -30)

const run = (actions: EditorAction[], state = createEditorState([TEXT])): EditorState =>
  actions.reduce(editorReducer, state)

const pickWord = (tokenId: string): EditorAction[] => [
  { type: 'toggleTool' },
  { type: 'pick', tokenId, center: CENTER, pointer: { x: 0, y: 0 } },
]

const wordAt = (state: EditorState, id: string) => findToken(state.paragraphs, id)?.text

const previewWord = (state: EditorState) => {
  if (state.picker.phase !== 'open') throw new Error('expected the wheel to be open')
  return getPickPreview(state.paragraphs, state.picker).word
}

describe('editorReducer', () => {
  it('arms and disarms the picker tool', () => {
    const armed = run([{ type: 'toggleTool' }])
    expect(armed.picker.phase).toBe('armed')
    expect(run([{ type: 'toggleTool' }], armed).picker.phase).toBe('idle')
    expect(run([{ type: 'cancel' }], armed).picker.phase).toBe('idle')
  })

  it('only opens the wheel on words that have synonyms', () => {
    expect(run(pickWord(IT)).picker.phase).toBe('armed')
    expect(run(pickWord(BEST)).picker.phase).toBe('open')
  })

  it('ignores picks when the tool is not armed', () => {
    const state = run([{ type: 'pick', tokenId: BEST, center: CENTER, pointer: { x: 0, y: 0 } }])
    expect(state.picker.phase).toBe('idle')
  })

  it('previews synonyms while dragging and commits the chosen one', () => {
    const dragged = run([...pickWord(BEST), { type: 'drag', pointer: JOY_STRONGEST }])
    expect(previewWord(dragged)).toBe('most jubilant')

    const released = run([{ type: 'release' }], dragged)
    expect(released.picker.phase).toBe('releasing')
    expect(wordAt(released, BEST)).toBe('best')

    const committed = run([{ type: 'commit' }], released)
    expect(committed.picker.phase).toBe('closing')
    expect(wordAt(committed, BEST)).toBe('most jubilant')

    expect(run([{ type: 'finish' }], committed).picker.phase).toBe('idle')
  })

  it('keeps the capitalization of the original word', () => {
    const dragged = run([...pickWord(LIGHT), { type: 'drag', pointer: JOY_STRONGEST }])
    expect(previewWord(dragged)).toBe('Splendor')
  })

  it('keeps the original word when released inside the center disc', () => {
    const state = run([
      ...pickWord(BEST),
      { type: 'drag', pointer: { x: 20, y: 10 } },
      { type: 'release' },
      { type: 'commit' },
    ])
    expect(wordAt(state, BEST)).toBe('best')
  })

  it('discards the selection when cancelled mid-drag', () => {
    const state = run([
      ...pickWord(BEST),
      { type: 'drag', pointer: JOY_STRONGEST },
      { type: 'cancel' },
    ])
    expect(state.picker.phase).toBe('releasing')
    expect(wordAt(run([{ type: 'commit' }], state), BEST)).toBe('best')
  })

  it('reopens a replaced word using its original synonym table', () => {
    const replaced = run([
      ...pickWord(LIGHT),
      { type: 'drag', pointer: JOY_STRONGEST },
      { type: 'release' },
      { type: 'commit' },
      { type: 'finish' },
    ])
    expect(wordAt(replaced, LIGHT)).toBe('Splendor')

    const reopened = run([...pickWord(LIGHT), { type: 'drag', pointer: DISGUST_MILDEST }], replaced)
    expect(previewWord(reopened)).toBe('Glare')
  })
})
