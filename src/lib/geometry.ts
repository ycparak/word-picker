export interface Point {
  x: number
  y: number
}

const DEGREES_TO_RADIANS = Math.PI / 180

/** Converts polar coordinates (SVG convention: 0° points right, angles grow clockwise). */
export function polarToPoint(radius: number, angleDeg: number): Point {
  const angle = angleDeg * DEGREES_TO_RADIANS
  return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) }
}

/** Angle of a point in degrees, normalized to (-180, 180]. */
export function pointAngle({ x, y }: Point): number {
  return Math.atan2(y, x) / DEGREES_TO_RADIANS
}

export function pointRadius({ x, y }: Point): number {
  return Math.hypot(x, y)
}

/** Normalizes an angle difference to (-180, 180]. */
export function angleDelta(fromDeg: number, toDeg: number): number {
  const delta = (((toDeg - fromDeg) % 360) + 360) % 360
  return delta > 180 ? delta - 360 : delta
}

export function subtractPoints(a: Point, b: Point): Point {
  return { x: a.x - b.x, y: a.y - b.y }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function formatPoint({ x, y }: Point): string {
  return `${round(x)} ${round(y)}`
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000
}

/**
 * SVG path for an annular sector whose straight sides are inset by `halfGap`, parallel to
 * the boundary rays. Neighbouring sectors drawn this way are separated by an even-width gap
 * (rather than a wedge that widens outwards).
 */
export function annularSectorPath(
  startDeg: number,
  endDeg: number,
  innerRadius: number,
  outerRadius: number,
  halfGap: number,
): string {
  const insetAt = (radius: number) => Math.asin(Math.min(1, halfGap / radius)) / DEGREES_TO_RADIANS
  const innerInset = insetAt(innerRadius)
  const outerInset = insetAt(outerRadius)

  const innerStart = polarToPoint(innerRadius, startDeg + innerInset)
  const outerStart = polarToPoint(outerRadius, startDeg + outerInset)
  const outerEnd = polarToPoint(outerRadius, endDeg - outerInset)
  const innerEnd = polarToPoint(innerRadius, endDeg - innerInset)
  const largeArc = endDeg - startDeg > 180 ? 1 : 0

  return [
    `M ${formatPoint(innerStart)}`,
    `L ${formatPoint(outerStart)}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${formatPoint(outerEnd)}`,
    `L ${formatPoint(innerEnd)}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${formatPoint(innerStart)}`,
    'Z',
  ].join(' ')
}
