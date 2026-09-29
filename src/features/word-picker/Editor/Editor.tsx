import type { PointerEvent } from 'react'
import { revealTokens, type Token } from '../../../lib/tokens'
import { isPickable } from '../editorState'
import styles from './Editor.module.css'

interface EditorProps {
  tokens: readonly Token[]
  /** Characters revealed so far by the intro typewriter (Infinity once it has finished). */
  visibleChars: number
  /** Whether words respond to hover and press (the picker tool is armed). */
  pickable: boolean
  /** Fades the text back while the wheel is open. */
  dimmed: boolean
  /** The word being picked. It is never dimmed. */
  activeTokenId: string | null
  /** Hides the active word while the wheel displays it instead. */
  hideActive: boolean
  onPickWord: (tokenId: string, word: HTMLElement, event: PointerEvent<HTMLElement>) => void
}

export function Editor({
  tokens,
  visibleChars,
  pickable,
  dimmed,
  activeTokenId,
  hideActive,
  onPickWord,
}: EditorProps) {
  return (
    <p className={styles.editor}>
      {revealTokens(tokens, visibleChars).map(({ token, text, trailing }) => {
        const isActive = token.id === activeTokenId
        const canPick = pickable && isPickable(token)

        return (
          // The trailing space belongs to the word, so hovering the gap after a word still
          // targets it (as in the prototype).
          <span
            key={token.id}
            className={styles.token}
            data-pickable={canPick || undefined}
            data-dimmed={(dimmed && !isActive) || undefined}
            onPointerDown={
              canPick
                ? (event) => {
                    const word = event.currentTarget.firstElementChild
                    if (word instanceof HTMLElement) onPickWord(token.id, word, event)
                  }
                : undefined
            }
          >
            <span className={styles.word} data-hidden={(isActive && hideActive) || undefined}>
              {text}
            </span>
            {trailing}
          </span>
        )
      })}
    </p>
  )
}
