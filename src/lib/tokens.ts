export interface Token {
  id: string
  /** Text before the word that no earlier word owns, e.g. an opening quotation mark. */
  leading: string
  /** Text currently shown for the word. */
  text: string
  /** Punctuation and whitespace that follow the word. */
  trailing: string
  /** Lowercased original word; stays stable when the word is replaced. */
  key: string
}

export interface VisibleToken {
  token: Token
  leading: string
  text: string
  trailing: string
}

/** Letters and digits, allowing inner apostrophes ("don't", "its"). */
const WORD_PATTERN = /[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu

/**
 * Splits text into word tokens. Punctuation and whitespace attach to the word before them, so
 * "way—in" becomes "way" (followed by "—") and "in".
 */
export function tokenize(text: string, firstIndex = 0): Token[] {
  const matches = Array.from(text.matchAll(WORD_PATTERN))

  return matches.map((match, index) => {
    const start = match.index
    const end = start + match[0].length
    const next = matches[index + 1]
    return {
      id: `token-${firstIndex + index}`,
      leading: index === 0 ? text.slice(0, start) : '',
      text: match[0],
      trailing: text.slice(end, next ? next.index : text.length),
      key: match[0].toLowerCase(),
    }
  })
}

/** Tokenizes each paragraph, numbering tokens across the whole document so ids stay unique. */
export function tokenizeParagraphs(paragraphs: readonly string[]): Token[][] {
  let nextIndex = 0
  return paragraphs.map((paragraph) => {
    const tokens = tokenize(paragraph, nextIndex)
    nextIndex += tokens.length
    return tokens
  })
}

export function findToken(
  paragraphs: readonly (readonly Token[])[],
  id: string,
): Token | undefined {
  for (const tokens of paragraphs) {
    const token = tokens.find((candidate) => candidate.id === id)
    if (token) return token
  }
  return undefined
}

export function textLength(tokens: readonly Token[]): number {
  return tokens.reduce(
    (length, token) => length + token.leading.length + token.text.length + token.trailing.length,
    0,
  )
}

/** Returns the tokens that are (at least partly) visible after `visibleChars` characters. */
export function revealTokens(tokens: readonly Token[], visibleChars: number): VisibleToken[] {
  const visible: VisibleToken[] = []
  let remaining = visibleChars

  const take = (part: string) => {
    const shown = part.slice(0, Math.max(0, remaining))
    remaining -= shown.length
    return shown
  }

  for (const token of tokens) {
    if (remaining <= 0) break
    visible.push({
      token,
      leading: take(token.leading),
      text: take(token.text),
      trailing: take(token.trailing),
    })
  }

  return visible
}

export function replaceTokenText(tokens: readonly Token[], id: string, text: string): Token[] {
  return tokens.map((token) => (token.id === id ? { ...token, text } : token))
}
