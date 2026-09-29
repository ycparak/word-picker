import { EMOTIONS, SEGMENT_SWEEP_DEG, type Emotion } from '../../../data/emotions'
import { INTENSITY_LEVELS, type Intensity } from '../../../data/synonyms'
import { angleDelta, clamp, pointAngle, pointRadius, type Point } from '../../../lib/geometry'

/** Wheel geometry in stage units, relative to the wheel center. */
export const WHEEL_GEOMETRY = {
  innerRadius: 115,
  outerRadius: 253,
  /** Even-width gap between neighbouring segments. */
  segmentGap: 12,
  /** The pointer selects a segment once it is this far from the center (just inside the ring). */
  selectionRadius: 108,
  /** Radial depth of each intensity band. */
  intensityBandDepth: 25,
  /** A selected segment always shows at least a sliver of fill. */
  minFillRadius: 119,
  disc: { solidRadius: 76, fadeRadius: 100 },
  tick: { innerRadius: 82, outerRadius: 115, width: 3.5, blur: 0.5 },
  /**
   * The wheel centers on the word's optical center (half its cap height above the
   * baseline), which sits slightly below the center of the word's text box.
   */
  wordCenterOffsetY: 2.5,
  /** Half the extent of the SVG canvas; labels sit up to ~345 units from the center. */
  canvasRadius: 360,
} as const

export interface WheelSelection {
  emotion: Emotion
  intensity: Intensity
  /** Outer radius of the fill, following the pointer. */
  fillRadius: number
}

export function segmentBounds(emotion: Emotion): { start: number; end: number } {
  const halfSweep = SEGMENT_SWEEP_DEG / 2
  return { start: emotion.centerAngle - halfSweep, end: emotion.centerAngle + halfSweep }
}

function isInSegmentGap(radius: number, offsetFromCenterDeg: number): boolean {
  const offsetFromBoundaryDeg = SEGMENT_SWEEP_DEG / 2 - Math.abs(offsetFromCenterDeg)
  const distanceToBoundary = radius * Math.sin((offsetFromBoundaryDeg * Math.PI) / 180)
  return distanceToBoundary < WHEEL_GEOMETRY.segmentGap / 2
}

/**
 * Maps a pointer position (relative to the wheel center) to the emotion segment and
 * intensity under it. Returns null inside the center disc or within a gap between segments.
 */
export function resolveSelection(pointer: Point): WheelSelection | null {
  const radius = pointRadius(pointer)
  if (radius < WHEEL_GEOMETRY.selectionRadius) return null

  const angle = pointAngle(pointer)
  const emotion = EMOTIONS.find(
    (candidate) => Math.abs(angleDelta(candidate.centerAngle, angle)) <= SEGMENT_SWEEP_DEG / 2,
  )
  if (!emotion) return null

  if (isInSegmentGap(radius, angleDelta(emotion.centerAngle, angle))) return null

  const band = Math.floor(
    (radius - WHEEL_GEOMETRY.selectionRadius) / WHEEL_GEOMETRY.intensityBandDepth,
  )
  const intensity = clamp(band, 0, INTENSITY_LEVELS - 1) as Intensity
  const fillRadius = clamp(
    Math.max(radius, WHEEL_GEOMETRY.minFillRadius),
    WHEEL_GEOMETRY.innerRadius,
    WHEEL_GEOMETRY.outerRadius,
  )

  return { emotion, intensity, fillRadius }
}
