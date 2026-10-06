import { EMOTIONS, SEGMENT_SWEEP_DEG, type Emotion } from '../../../data/emotions'
import { INTENSITY_LEVELS, type Intensity } from '../../../data/synonyms'
import {
  angleDelta,
  clamp,
  pointAngle,
  pointRadius,
  polarToPoint,
  type Point,
} from '../../../lib/geometry'

/**
 * Wheel geometry in CSS px, relative to the wheel center. Sized for 20px body text; the
 * proportions (disc, ring depth, gaps, bands) follow the original prototype.
 */
export const WHEEL_GEOMETRY = {
  innerRadius: 66,
  outerRadius: 146,
  /** Even-width gap between neighbouring segments. */
  segmentGap: 8,
  /** The pointer selects a segment once it is this far from the center (just inside the ring). */
  selectionRadius: 62,
  /** Radial depth of each intensity band. */
  intensityBandDepth: 21,
  /** A selected segment always shows at least a sliver of fill. */
  minFillRadius: 69,
  disc: { solidRadius: 44, fadeRadius: 58 },
  tick: { innerRadius: 47, outerRadius: 66, width: 2, blur: 0.4 },
  label: { gap: 14, fontSize: 13 },
  /** Half the extent of the SVG canvas, with room for the labels. */
  canvasRadius: 240,
} as const

export interface WheelSelection {
  emotion: Emotion
  intensity: Intensity
  /** Outer radius of the fill, following the pointer. */
  fillRadius: number
}

export type LabelAnchor = 'start' | 'middle' | 'end'

export interface LabelPlacement extends Point {
  /** SVG `text-anchor`; the label is vertically centered on `y`. */
  anchor: LabelAnchor
}

export function segmentBounds(emotion: Emotion): { start: number; end: number } {
  const halfSweep = SEGMENT_SWEEP_DEG / 2
  return { start: emotion.centerAngle - halfSweep, end: emotion.centerAngle + halfSweep }
}

/**
 * Places a label just outside the ring on its segment's center line, growing away from the
 * wheel: left-aligned on the right side, right-aligned on the left, centered at top and bottom.
 */
export function labelPlacement(angleDeg: number): LabelPlacement {
  const { outerRadius, label } = WHEEL_GEOMETRY
  const angle = (angleDeg * Math.PI) / 180
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const anchor: LabelAnchor = Math.abs(cos) < 0.25 ? 'middle' : cos > 0 ? 'start' : 'end'
  // Push vertically-placed labels out by half their height so they clear the ring evenly.
  const radius = outerRadius + label.gap + (Math.abs(sin) * label.fontSize) / 2
  return { ...polarToPoint(radius, angleDeg), anchor }
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
