import { getSynonym, hasSynonyms, matchCase } from '../../data/synonyms'
import type { Point } from '../../lib/geometry'
import { findToken, replaceTokenText, tokenizeParagraphs, type Token } from '../../lib/tokens'
import { resolveSelection, type WheelSelection } from './EmotionWheel/wheelModel'

export interface ActivePick {
  tokenId: string
  /** Wheel center, relative to the document: the center of the picked word. */
  center: Point
  /** Pointer position relative to the wheel center; null when the pick was cancelled. */
  pointer: Point | null
}

/**
 * idle → armed (tool selected) → open (word pressed, wheel showing) → releasing (pointer up,
 * brief hold on the chosen word) → closing (word committed, wheel fading out) → idle.
 */
export type PickerState =
  | { phase: 'idle' }
  | { phase: 'armed' }
  | ({ phase: 'open' | 'releasing' | 'closing' } & ActivePick)

export type PickerPhase = PickerState['phase']

export interface EditorState {
  paragraphs: Token[][]
  picker: PickerState
}

export type EditorAction =
  | { type: 'toggleTool' }
  | { type: 'cancel' }
  | { type: 'pick'; tokenId: string; center: Point; pointer: Point }
  | { type: 'drag'; pointer: Point }
  | { type: 'release' }
  | { type: 'commit' }
  | { type: 'finish' }

export interface PickPreview {
  selection: WheelSelection | null
  /** The word to show for the current pointer position. */
  word: string
}

export function createEditorState(paragraphs: readonly string[]): EditorState {
  return { paragraphs: tokenizeParagraphs(paragraphs), picker: { phase: 'idle' } }
}

export function isPickable(token: Token): boolean {
  return hasSynonyms(token.key)
}

export function getPickPreview(
  paragraphs: readonly (readonly Token[])[],
  pick: ActivePick,
): PickPreview {
  const token = findToken(paragraphs, pick.tokenId)
  const original = token?.text ?? ''
  const selection = pick.pointer ? resolveSelection(pick.pointer) : null
  if (!token || !selection) return { selection, word: original }

  const synonym = getSynonym(token.key, selection.emotion.id, selection.intensity)
  return { selection, word: synonym ? matchCase(original, synonym) : original }
}

export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  const { picker } = state

  switch (action.type) {
    case 'toggleTool':
      if (picker.phase === 'idle') return { ...state, picker: { phase: 'armed' } }
      if (picker.phase === 'armed') return { ...state, picker: { phase: 'idle' } }
      return state

    case 'cancel':
      if (picker.phase === 'armed') return { ...state, picker: { phase: 'idle' } }
      if (picker.phase === 'open') {
        return { ...state, picker: { ...picker, phase: 'releasing', pointer: null } }
      }
      return state

    case 'pick': {
      if (picker.phase !== 'armed') return state
      const token = findToken(state.paragraphs, action.tokenId)
      if (!token || !isPickable(token)) return state
      const { tokenId, center, pointer } = action
      return { ...state, picker: { phase: 'open', tokenId, center, pointer } }
    }

    case 'drag':
      if (picker.phase !== 'open') return state
      return { ...state, picker: { ...picker, pointer: action.pointer } }

    case 'release':
      if (picker.phase !== 'open') return state
      return { ...state, picker: { ...picker, phase: 'releasing' } }

    case 'commit': {
      if (picker.phase !== 'releasing') return state
      const { word } = getPickPreview(state.paragraphs, picker)
      return {
        paragraphs: state.paragraphs.map((tokens) =>
          replaceTokenText(tokens, picker.tokenId, word),
        ),
        picker: { ...picker, phase: 'closing' },
      }
    }

    case 'finish':
      if (picker.phase !== 'closing') return state
      return { ...state, picker: { phase: 'idle' } }
  }
}
