import { Fragment, type PointerEvent } from 'react'
import { revealTokens, type Token } from '../../../lib/tokens'
import { isPickable } from '../editorState'
import styles from './Editor.module.css'

interface EditorProps {
  paragraphs: readonly (readonly Token[])[]
  /** Characters of the first paragraph typed so far by the intro (Infinity once finished). */
  typedChars: number
  /** Shows the paragraphs after the first; they fade in once the intro has finished. */
  revealRest: boolean
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
  paragraphs,
  typedChars,
  revealRest,
  pickable,
  dimmed,
  activeTokenId,
  hideActive,
  onPickWord,
}: EditorProps) {
  return (
    <div className={styles.editor}>
      {paragraphs.map((tokens, index) => {
        const isLead = index === 0
        const visibleTokens = revealTokens(tokens, isLead ? typedChars : Number.POSITIVE_INFINITY)

        return (
          <p
            key={tokens[0]?.id ?? index}
            className={styles.paragraph}
            data-pending={(!isLead && !revealRest) || undefined}
          >
            {visibleTokens.map(({ token, leading, text, trailing }) => {
              const isActive = token.id === activeTokenId
              const canPick = pickable && isPickable(token)

              return (
                <Fragment key={token.id}>
                  {leading && (
                    <span className={styles.token} data-dimmed={dimmed || undefined}>
                      {leading}
                    </span>
                  )}
                  {/* Punctuation and space after a word belong to it, so hovering the gap after
                      a word still targets it (as in the prototype). */}
                  <span
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
                    <span
                      className={styles.word}
                      data-hidden={(isActive && hideActive) || undefined}
                    >
                      {text}
                    </span>
                    {trailing}
                  </span>
                </Fragment>
              )
            })}
          </p>
        )
      })}
    </div>
  )
}
