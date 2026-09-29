import type { EmotionId } from './emotions'

/** Synonyms ordered from the mildest to the most intense. */
export type SynonymLadder = readonly [string, string, string, string]

export type SynonymTable = Readonly<Record<EmotionId, SynonymLadder>>

export const INTENSITY_LEVELS = 4

export type Intensity = 0 | 1 | 2 | 3

/**
 * Emotional synonyms, keyed by the word as it was originally written.
 *
 * The "timid" disgust, fear (first three) and joy ladders are taken verbatim from the
 * prototype, spelling included. Everything else is new content that fills out the wheel.
 */
export const SYNONYMS: Readonly<Record<string, SynonymTable>> = {
  timid: {
    anger: ['grumpy', 'irritable', 'hostile', 'ferocious'],
    disgust: ['unpalatable', 'offensive', 'impenitent', 'malodorus'],
    fear: ['cowardly', 'unassertive', 'afraid', 'terrified'],
    joy: ['philhellenic', 'joyful', 'playful', 'elated'],
    sad: ['wistful', 'gloomy', 'forlorn', 'despondent'],
    surprise: ['curious', 'startled', 'astonished', 'flabbergasted'],
  },
  dog: {
    anger: ['cur', 'brute', 'beast', 'hellhound'],
    disgust: ['mutt', 'mongrel', 'fleabag', 'scavenger'],
    fear: ['hound', 'wolf', 'predator', 'monster'],
    joy: ['pup', 'buddy', 'pal', 'darling'],
    sad: ['stray', 'orphan', 'outcast', 'wretch'],
    surprise: ['creature', 'critter', 'oddity', 'marvel'],
  },
  jumped: {
    anger: ['snapped', 'lunged', 'charged', 'attacked'],
    disgust: ['balked', 'recoiled', 'shuddered', 'retched'],
    fear: ['flinched', 'cowered', 'trembled', 'panicked'],
    joy: ['hopped', 'skipped', 'bounded', 'leapt'],
    sad: ['sighed', 'whimpered', 'wept', 'howled'],
    surprise: ['blinked', 'started', 'jolted', 'bolted'],
  },
  thundering: {
    anger: ['grumbling', 'roaring', 'raging', 'furious'],
    disgust: ['grating', 'jarring', 'harsh', 'hideous'],
    fear: ['looming', 'ominous', 'menacing', 'terrifying'],
    joy: ['lively', 'rousing', 'booming', 'triumphant'],
    sad: ['distant', 'mournful', 'somber', 'doleful'],
    surprise: ['sudden', 'abrupt', 'startling', 'deafening'],
  },
  sound: {
    anger: ['racket', 'clamor', 'din', 'uproar'],
    disgust: ['noise', 'screech', 'shriek', 'cacophony'],
    fear: ['rumble', 'growl', 'roar', 'shriek'],
    joy: ['music', 'melody', 'chorus', 'fanfare'],
    sad: ['hum', 'sigh', 'moan', 'wail'],
    surprise: ['pop', 'crack', 'bang', 'boom'],
  },
}

export function hasSynonyms(key: string): boolean {
  return Object.hasOwn(SYNONYMS, key)
}

export function getSynonym(key: string, emotion: EmotionId, intensity: Intensity): string | null {
  if (!hasSynonyms(key)) return null
  return SYNONYMS[key]?.[emotion][intensity] ?? null
}
