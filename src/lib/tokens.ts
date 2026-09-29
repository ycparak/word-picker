export interface Token {
  id: string
  /** Text currently shown for the word. */
  text: string
  /** Whitespace that follows the word. */
  trailing: string
  /** Lowercased original word; stays stable when the word is replaced. */
  key: string
}

export interface VisibleToken {
  token: Token
  text: string
  trailing: string
}

/** Splits text into word tokens, each carrying the whitespace that follows it. */
export function tokenize(text: string): Token[] {
  return Array.from(text.matchAll(/(\S+)(\s*)/g), (match, index) => {
    const [, word = '', trailing = ''] = match
    return { id: `token-${index}`, text: word, trailing, key: word.toLowerCase() }
  })
}

export function textLength(tokens: readonly Token[]): number {
  return tokens.reduce((length, token) => length + token.text.length + token.trailing.length, 0)
}

/** Returns the tokens that are (at least partly) visible after `visibleChars` characters. */
export function revealTokens(tokens: readonly Token[], visibleChars: number): VisibleToken[] {
  const visible: VisibleToken[] = []
  let remaining = visibleChars

  for (const token of tokens) {
    if (remaining <= 0) break
    const text = token.text.slice(0, remaining)
    remaining -= text.length
    const trailing = token.trailing.slice(0, Math.max(0, remaining))
    remaining -= trailing.length
    visible.push({ token, text, trailing })
  }

  return visible
}

export function replaceTokenText(tokens: readonly Token[], id: string, text: string): Token[] {
  return tokens.map((token) => (token.id === id ? { ...token, text } : token))
}
