import { describe, expect, it } from 'vitest'
import { tokenize } from '../lib/tokens'
import { DOCUMENT_PARAGRAPHS } from './document'
import { getSynonym, matchCase, SYNONYMS } from './synonyms'

describe('SYNONYMS', () => {
  it('covers words from the first paragraph of the document', () => {
    const words = new Set(tokenize(DOCUMENT_PARAGRAPHS[0] ?? '').map(({ key }) => key))
    for (const key of Object.keys(SYNONYMS)) expect(words).toContain(key)
  })

  it('looks up a synonym by emotion and intensity', () => {
    expect(getSynonym('hope', 'joy', 0)).toBe('cheer')
    expect(getSynonym('hope', 'joy', 3)).toBe('euphoria')
    expect(getSynonym('times', 'joy', 0)).toBeNull()
  })
})

describe('matchCase', () => {
  it('follows the capitalization of the original word', () => {
    expect(matchCase('light', 'sunshine')).toBe('sunshine')
    expect(matchCase('Light', 'sunshine')).toBe('Sunshine')
    expect(matchCase('Light', 'last light')).toBe('Last light')
    expect(matchCase('LIGHT', 'sunshine')).toBe('SUNSHINE')
  })

  it('treats a single capital letter as capitalized, not all caps', () => {
    expect(matchCase('I', 'me')).toBe('Me')
  })
})
