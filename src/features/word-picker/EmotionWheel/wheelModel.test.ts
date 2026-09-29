import { describe, expect, it } from 'vitest'
import { polarToPoint } from '../../../lib/geometry'
import { resolveSelection, WHEEL_GEOMETRY } from './wheelModel'

const at = (radius: number, angle: number) => resolveSelection(polarToPoint(radius, angle))

describe('resolveSelection', () => {
  it('selects nothing inside the center disc', () => {
    expect(at(0, 0)).toBeNull()
    expect(at(WHEEL_GEOMETRY.selectionRadius - 1, 90)).toBeNull()
  })

  it('picks the segment under the pointer', () => {
    expect(at(150, -90)?.emotion.id).toBe('anger')
    expect(at(150, -30)?.emotion.id).toBe('disgust')
    expect(at(150, 30)?.emotion.id).toBe('fear')
    expect(at(150, 90)?.emotion.id).toBe('joy')
    expect(at(150, 150)?.emotion.id).toBe('sad')
    expect(at(150, -150)?.emotion.id).toBe('surprise')
  })

  it('selects nothing in the gap between segments', () => {
    // 4 units from the 0° boundary, inside the 6-unit half gap.
    expect(resolveSelection({ x: 167, y: -4 })).toBeNull()
    expect(resolveSelection({ x: 167, y: -8 })?.emotion.id).toBe('disgust')
  })

  it('maps distance to four intensity bands', () => {
    expect(at(110, 90)?.intensity).toBe(0)
    expect(at(140, 90)?.intensity).toBe(1)
    expect(at(165, 90)?.intensity).toBe(2)
    expect(at(190, 90)?.intensity).toBe(3)
    expect(at(400, 90)?.intensity).toBe(3)
  })

  it('fills from the inner ring to the pointer, within the ring', () => {
    expect(at(110, 90)?.fillRadius).toBe(WHEEL_GEOMETRY.minFillRadius)
    expect(at(180, 90)?.fillRadius).toBeCloseTo(180)
    expect(at(400, 90)?.fillRadius).toBe(WHEEL_GEOMETRY.outerRadius)
  })
})
