import { describe, expect, it } from 'vitest'
import { polarToPoint } from '../../../lib/geometry'
import { labelPlacement, resolveSelection, WHEEL_GEOMETRY } from './wheelModel'

const at = (radius: number, angle: number) => resolveSelection(polarToPoint(radius, angle))

describe('resolveSelection', () => {
  it('selects nothing inside the center disc', () => {
    expect(at(0, 0)).toBeNull()
    expect(at(WHEEL_GEOMETRY.selectionRadius - 1, 90)).toBeNull()
  })

  it('picks the segment under the pointer', () => {
    expect(at(100, -90)?.emotion.id).toBe('anger')
    expect(at(100, -30)?.emotion.id).toBe('disgust')
    expect(at(100, 30)?.emotion.id).toBe('fear')
    expect(at(100, 90)?.emotion.id).toBe('joy')
    expect(at(100, 150)?.emotion.id).toBe('sad')
    expect(at(100, -150)?.emotion.id).toBe('surprise')
  })

  it('selects nothing in the gap between segments', () => {
    // 3px from the 0° boundary, inside the 4px half gap.
    expect(resolveSelection({ x: 100, y: -3 })).toBeNull()
    expect(resolveSelection({ x: 100, y: -6 })?.emotion.id).toBe('disgust')
  })

  it('maps distance to four intensity bands', () => {
    expect(at(65, 90)?.intensity).toBe(0)
    expect(at(90, 90)?.intensity).toBe(1)
    expect(at(110, 90)?.intensity).toBe(2)
    expect(at(130, 90)?.intensity).toBe(3)
    expect(at(400, 90)?.intensity).toBe(3)
  })

  it('fills from the inner ring to the pointer, within the ring', () => {
    expect(at(64, 90)?.fillRadius).toBe(WHEEL_GEOMETRY.minFillRadius)
    expect(at(120, 90)?.fillRadius).toBeCloseTo(120)
    expect(at(400, 90)?.fillRadius).toBe(WHEEL_GEOMETRY.outerRadius)
  })
})

describe('labelPlacement', () => {
  it('grows labels away from the wheel', () => {
    expect(labelPlacement(-90).anchor).toBe('middle')
    expect(labelPlacement(90).anchor).toBe('middle')
    expect(labelPlacement(-30).anchor).toBe('start')
    expect(labelPlacement(30).anchor).toBe('start')
    expect(labelPlacement(150).anchor).toBe('end')
    expect(labelPlacement(210).anchor).toBe('end')
  })

  it('keeps every label clear of the ring', () => {
    for (const angle of [-90, -30, 30, 90, 150, 210]) {
      const { x, y } = labelPlacement(angle)
      expect(Math.hypot(x, y)).toBeGreaterThanOrEqual(
        WHEEL_GEOMETRY.outerRadius + WHEEL_GEOMETRY.label.gap,
      )
    }
  })
})
