import type { EmotionId } from './emotions'

/** Synonyms ordered from the mildest to the most intense. */
export type SynonymLadder = readonly [string, string, string, string]

export type SynonymTable = Readonly<Record<EmotionId, SynonymLadder>>

export const INTENSITY_LEVELS = 4

export type Intensity = 0 | 1 | 2 | 3

/**
 * Emotional alternatives for the key words of the passage, keyed by the lowercased word as it
 * was originally written. Each ladder fits the word's slot in the sentence ("the ___ of times",
 * "the age of ___", "its ___ authorities"), and is written in lowercase: `matchCase` restores
 * capitals such as "Light" and "Darkness".
 */
export const SYNONYMS: Readonly<Record<string, SynonymTable>> = {
  best: {
    anger: ['testiest', 'angriest', 'fiercest', 'most furious'],
    disgust: ['plainest', 'shabbiest', 'vilest', 'most repugnant'],
    fear: ['uneasiest', 'scariest', 'darkest', 'most terrifying'],
    joy: ['nicest', 'happiest', 'merriest', 'most jubilant'],
    sad: ['dullest', 'saddest', 'bleakest', 'most tragic'],
    surprise: ['oddest', 'strangest', 'wildest', 'most astonishing'],
  },
  worst: {
    anger: ['sourest', 'bitterest', 'most hostile', 'most enraging'],
    disgust: ['ugliest', 'nastiest', 'foulest', 'most revolting'],
    fear: ['grimmest', 'direst', 'most harrowing', 'most horrifying'],
    joy: ['silliest', 'luckiest', 'giddiest', 'most euphoric'],
    sad: ['dreariest', 'loneliest', 'most sorrowful', 'most heartbreaking'],
    surprise: ['queerest', 'most curious', 'most shocking', 'most staggering'],
  },
  wisdom: {
    anger: ['conviction', 'zeal', 'fervor', 'fury'],
    disgust: ['pedantry', 'smugness', 'arrogance', 'conceit'],
    fear: ['caution', 'prudence', 'vigilance', 'paranoia'],
    joy: ['insight', 'wit', 'brilliance', 'genius'],
    sad: ['reflection', 'sobriety', 'solemnity', 'melancholy'],
    surprise: ['curiosity', 'discovery', 'revelation', 'epiphany'],
  },
  foolishness: {
    anger: ['petulance', 'recklessness', 'belligerence', 'rage'],
    disgust: ['silliness', 'vulgarity', 'idiocy', 'depravity'],
    fear: ['hesitation', 'naivety', 'gullibility', 'panic'],
    joy: ['whimsy', 'playfulness', 'frivolity', 'revelry'],
    sad: ['aimlessness', 'folly', 'futility', 'ruin'],
    surprise: ['absurdity', 'eccentricity', 'lunacy', 'madness'],
  },
  belief: {
    anger: ['insistence', 'conviction', 'zealotry', 'fanaticism'],
    disgust: ['dogma', 'piety', 'sanctimony', 'bigotry'],
    fear: ['superstition', 'doubt', 'dread', 'terror'],
    joy: ['trust', 'faith', 'optimism', 'rapture'],
    sad: ['yearning', 'nostalgia', 'resignation', 'despondency'],
    surprise: ['wonder', 'awe', 'marvels', 'miracles'],
  },
  incredulity: {
    anger: ['skepticism', 'suspicion', 'indignation', 'outrage'],
    disgust: ['cynicism', 'disdain', 'scorn', 'contempt'],
    fear: ['unease', 'distrust', 'alarm', 'paranoia'],
    joy: ['amusement', 'whimsy', 'delight', 'marvel'],
    sad: ['disbelief', 'disillusion', 'dejection', 'despair'],
    surprise: ['surprise', 'amazement', 'astonishment', 'stupefaction'],
  },
  light: {
    anger: ['heat', 'fire', 'flame', 'inferno'],
    disgust: ['glare', 'gaudiness', 'garishness', 'luridness'],
    fear: ['glimmer', 'flicker', 'lightning', 'wildfire'],
    joy: ['sunshine', 'brightness', 'radiance', 'splendor'],
    sad: ['haze', 'dusk', 'pallor', 'fading'],
    surprise: ['sparkle', 'flash', 'dazzle', 'brilliance'],
  },
  darkness: {
    anger: ['shadow', 'storm', 'wrath', 'tempest'],
    disgust: ['murk', 'filth', 'squalor', 'rot'],
    fear: ['dimness', 'gloom', 'blackness', 'terror'],
    joy: ['dusk', 'evening', 'starlight', 'moonlight'],
    sad: ['grayness', 'sorrow', 'mourning', 'grief'],
    surprise: ['mystery', 'eclipse', 'blackout', 'oblivion'],
  },
  hope: {
    anger: ['defiance', 'resolve', 'rebellion', 'revolt'],
    disgust: ['greed', 'vanity', 'pretension', 'delusion'],
    fear: ['doubt', 'worry', 'anxiety', 'dread'],
    joy: ['cheer', 'optimism', 'elation', 'euphoria'],
    sad: ['wishing', 'yearning', 'longing', 'pining'],
    surprise: ['chance', 'luck', 'fortune', 'miracles'],
  },
  despair: {
    anger: ['frustration', 'resentment', 'bitterness', 'rage'],
    disgust: ['weariness', 'decay', 'squalor', 'rot'],
    fear: ['worry', 'fear', 'dread', 'terror'],
    joy: ['calm', 'relief', 'solace', 'rebirth'],
    sad: ['sorrow', 'grief', 'misery', 'anguish'],
    surprise: ['upheaval', 'turmoil', 'chaos', 'catastrophe'],
  },
  noisiest: {
    anger: ['brashest', 'shrillest', 'fiercest', 'most belligerent'],
    disgust: ['coarsest', 'crassest', 'most pompous', 'most odious'],
    fear: ['sternest', 'grimmest', 'most menacing', 'most fearsome'],
    joy: ['liveliest', 'jolliest', 'most jubilant', 'most rapturous'],
    sad: ['dullest', 'dourest', 'gloomiest', 'most mournful'],
    surprise: ['boldest', 'quirkiest', 'most outlandish', 'most sensational'],
  },
  authorities: {
    anger: ['critics', 'zealots', 'agitators', 'firebrands'],
    disgust: ['pundits', 'blowhards', 'charlatans', 'demagogues'],
    fear: ['watchmen', 'doomsayers', 'alarmists', 'prophets of doom'],
    joy: ['enthusiasts', 'admirers', 'champions', 'evangelists'],
    sad: ['skeptics', 'pessimists', 'mourners', 'lamenters'],
    surprise: ['onlookers', 'gossips', 'sensationalists', 'oracles'],
  },
}

export function hasSynonyms(key: string): boolean {
  return Object.hasOwn(SYNONYMS, key)
}

export function getSynonym(key: string, emotion: EmotionId, intensity: Intensity): string | null {
  if (!hasSynonyms(key)) return null
  return SYNONYMS[key]?.[emotion][intensity] ?? null
}

/** Applies the capitalization of `original` ("Light", "LIGHT", "light") to `replacement`. */
export function matchCase(original: string, replacement: string): string {
  if (original.length > 1 && original === original.toUpperCase()) return replacement.toUpperCase()
  const first = original.charAt(0)
  if (first !== first.toLowerCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1)
  }
  return replacement
}
