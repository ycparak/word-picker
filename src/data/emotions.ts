export const EMOTION_IDS = ['anger', 'disgust', 'fear', 'joy', 'sad', 'surprise'] as const

export type EmotionId = (typeof EMOTION_IDS)[number]

export interface Emotion {
  id: EmotionId
  label: string
  /** Direction of the segment's center, in degrees (SVG convention: 0° = right, clockwise). */
  centerAngle: number
  /** Fill shown while the segment is selected. */
  color: string
  /** Color of the small tick on the center disc. */
  tickColor: string
}

/**
 * Segment order and colors from the prototype. The anger, sad and surprise fills never appear
 * in the reference recording; their colors are derived from the tick colors, which do.
 */
export const EMOTIONS: readonly Emotion[] = [
  { id: 'anger', label: 'anger', centerAngle: -90, color: '#ff9ea1', tickColor: '#ff9ea1' },
  { id: 'disgust', label: 'disgust', centerAngle: -30, color: '#90fea1', tickColor: '#90fea1' },
  { id: 'fear', label: 'fear', centerAngle: 30, color: '#8b8b8b', tickColor: '#777777' },
  { id: 'joy', label: 'joy', centerAngle: 90, color: '#feed4f', tickColor: '#feed4f' },
  { id: 'sad', label: 'sad', centerAngle: 150, color: '#b6b6ff', tickColor: '#b6b6ff' },
  { id: 'surprise', label: 'surprise', centerAngle: 210, color: '#bebebe', tickColor: '#bebebe' },
]

/** Every segment spans the same arc. */
export const SEGMENT_SWEEP_DEG = 360 / EMOTIONS.length
