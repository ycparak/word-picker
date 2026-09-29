import { describe, expect, it } from 'vitest'
import { replaceTokenText, revealTokens, textLength, tokenize } from './tokens'

const SENTENCE = 'The timid dog'

describe('tokenize', () => {
  it('splits words and keeps the whitespace after each one', () => {
    expect(tokenize(SENTENCE)).toEqual([
      { id: 'token-0', text: 'The', trailing: ' ', key: 'the' },
      { id: 'token-1', text: 'timid', trailing: ' ', key: 'timid' },
      { id: 'token-2', text: 'dog', trailing: '', key: 'dog' },
    ])
  })

  it('counts every character', () => {
    expect(textLength(tokenize(SENTENCE))).toBe(SENTENCE.length)
  })
})

describe('revealTokens', () => {
  const tokens = tokenize(SENTENCE)
  const render = (count: number) =>
    revealTokens(tokens, count)
      .map(({ text, trailing }) => text + trailing)
      .join('')

  it('reveals text character by character', () => {
    expect(render(0)).toBe('')
    expect(render(6)).toBe('The ti')
    expect(render(10)).toBe('The timid ')
    expect(render(Number.POSITIVE_INFINITY)).toBe(SENTENCE)
  })
})

describe('replaceTokenText', () => {
  it('replaces the text but keeps the original key', () => {
    const [, timid] = replaceTokenText(tokenize(SENTENCE), 'token-1', 'elated')
    expect(timid).toMatchObject({ text: 'elated', key: 'timid' })
  })
})
