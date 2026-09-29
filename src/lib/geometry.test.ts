import { describe, expect, it } from 'vitest'
import { angleDelta, annularSectorPath, polarToPoint, pointAngle, pointRadius } from './geometry'

describe('polar helpers', () => {
  it('uses SVG orientation: 0° points right, 90° points down', () => {
    const right = polarToPoint(10, 0)
    const down = polarToPoint(10, 90)
    expect(right.x).toBeCloseTo(10)
    expect(right.y).toBeCloseTo(0)
    expect(down.x).toBeCloseTo(0)
    expect(down.y).toBeCloseTo(10)
  })

  it('round-trips angle and radius', () => {
    const point = polarToPoint(150, -30)
    expect(pointRadius(point)).toBeCloseTo(150)
    expect(pointAngle(point)).toBeCloseTo(-30)
  })

  it('normalizes angle differences to (-180, 180]', () => {
    expect(angleDelta(170, -170)).toBeCloseTo(20)
    expect(angleDelta(-170, 170)).toBeCloseTo(-20)
    expect(angleDelta(210, -150)).toBeCloseTo(0)
  })
})

describe('annularSectorPath', () => {
  it('draws two straight sides and two arcs', () => {
    const path = annularSectorPath(-60, 0, 115, 253, 6)
    expect(path.match(/L /g)).toHaveLength(2)
    expect(path.match(/A /g)).toHaveLength(2)
    expect(path.endsWith('Z')).toBe(true)
  })

  it('insets the sides so the gap has an even width', () => {
    const path = annularSectorPath(0, 60, 100, 200, 6)
    const [innerStart, outerStart] = [...path.matchAll(/[ML] (-?[\d.]+) (-?[\d.]+)/g)].map(
      ([, x, y]) => ({ x: Number(x), y: Number(y) }),
    )
    // Both ends of the first side sit 6 units from the 0° boundary ray.
    expect(innerStart?.y).toBeCloseTo(6)
    expect(outerStart?.y).toBeCloseTo(6)
  })
})
