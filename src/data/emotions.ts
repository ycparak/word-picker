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
  /** Label anchor (horizontal center, baseline) relative to the wheel center. */
  labelAnchor: { x: number; y: number }
  /** Vertical stretch applied to the label about its baseline (the design stretches "fear"). */
  labelScaleY?: number
}

/**
 * Segment order and styling from the prototype. Label anchors were hand-placed in the
 * original design, so they are recorded here rather than derived from the angles.
 *
 * The anger, sad and surprise fills never appear in the reference recording; their colors
 * are derived from the tick colors, which do.
 */
export const EMOTIONS: readonly Emotion[] = [
  {
    id: 'anger',
    label: 'anger',
    centerAngle: -90,
    color: '#ff9ea1',
    tickColor: '#ff9ea1',
    labelAnchor: { x: -6.5, y: -273 },
  },
  {
    id: 'disgust',
    label: 'disgust',
    centerAngle: -30,
    color: '#90fea1',
    tickColor: '#90fea1',
    labelAnchor: { x: 277, y: -149.5 },
  },
  {
    id: 'fear',
    label: 'fear',
    centerAngle: 30,
    color: '#8b8b8b',
    tickColor: '#777777',
    labelAnchor: { x: 266, y: 144.5 },
    labelScaleY: 1.25,
  },
  {
    id: 'joy',
    label: 'joy',
    centerAngle: 90,
    color: '#feed4f',
    tickColor: '#feed4f',
    labelAnchor: { x: -4, y: 290.5 },
  },
  {
    id: 'sad',
    label: 'sad',
    centerAngle: 150,
    color: '#b6b6ff',
    tickColor: '#b6b6ff',
    labelAnchor: { x: -257.5, y: 156.5 },
  },
  {
    id: 'surprise',
    label: 'surprise',
    centerAngle: 210,
    color: '#bebebe',
    tickColor: '#bebebe',
    labelAnchor: { x: -286.5, y: -138.5 },
  },
]

/** Every segment spans the same arc. */
export const SEGMENT_SWEEP_DEG = 360 / EMOTIONS.length
