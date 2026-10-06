import { describe, expect, it } from 'vitest'
import {
  findToken,
  replaceTokenText,
  revealTokens,
  textLength,
  tokenize,
  tokenizeParagraphs,
} from './tokens'

const SENTENCE = '“It was the best—of times.”'

const render = (text: string, count = Number.POSITIVE_INFINITY) =>
  revealTokens(tokenize(text), count)
    .map(({ leading, text: word, trailing }) => leading + word + trailing)
    .join('')

describe('tokenize', () => {
  it('attaches punctuation and spaces to the word before them', () => {
    expect(
      tokenize(SENTENCE).map(({ leading, text, trailing }) => [leading, text, trailing]),
    ).toEqual([
      ['“', 'It', ' '],
      ['', 'was', ' '],
      ['', 'the', ' '],
      ['', 'best', '—'],
      ['', 'of', ' '],
      ['', 'times', '.”'],
    ])
  })

  it('keys words by their lowercased form', () => {
    expect(tokenize('Light').map(({ key }) => key)).toEqual(['light'])
  })

  it('keeps apostrophes inside words', () => {
    expect(tokenize("don't take it").map(({ text }) => text)).toEqual(["don't", 'take', 'it'])
  })

  it('counts every character', () => {
    expect(textLength(tokenize(SENTENCE))).toBe(SENTENCE.length)
  })
})

describe('revealTokens', () => {
  it('reveals text character by character', () => {
    expect(render(SENTENCE, 0)).toBe('')
    expect(render(SENTENCE, 1)).toBe('“')
    expect(render(SENTENCE, 7)).toBe('“It was')
    expect(render(SENTENCE, 17)).toBe('“It was the best—')
    expect(render(SENTENCE)).toBe(SENTENCE)
  })
})

describe('replaceTokenText', () => {
  it('replaces the text but keeps the original key', () => {
    const tokens = replaceTokenText(tokenize(SENTENCE), 'token-3', 'happiest')
    expect(tokens[3]).toMatchObject({ text: 'happiest', key: 'best', trailing: '—' })
  })
})

describe('tokenizeParagraphs', () => {
  it('numbers tokens across paragraphs so ids stay unique', () => {
    const paragraphs = tokenizeParagraphs(['It was', 'the best'])
    expect(paragraphs.map((tokens) => tokens.map(({ id }) => id))).toEqual([
      ['token-0', 'token-1'],
      ['token-2', 'token-3'],
    ])
    expect(findToken(paragraphs, 'token-3')?.text).toBe('best')
    expect(findToken(paragraphs, 'token-9')).toBeUndefined()
  })
})
