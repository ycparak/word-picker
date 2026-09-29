import { STAGE_WIDTH } from '../config/stage'
import type { Point } from './geometry'

/** Converts viewport (client) coordinates to unscaled stage coordinates. */
export function clientToStage(stage: HTMLElement, clientX: number, clientY: number): Point {
  const rect = stage.getBoundingClientRect()
  const unitsPerPixel = rect.width > 0 ? STAGE_WIDTH / rect.width : 1
  return {
    x: (clientX - rect.left) * unitsPerPixel,
    y: (clientY - rect.top) * unitsPerPixel,
  }
}

/** Center of an element's box, in stage coordinates. */
export function elementCenterInStage(stage: HTMLElement, element: Element): Point {
  const rect = element.getBoundingClientRect()
  return clientToStage(stage, rect.left + rect.width / 2, rect.top + rect.height / 2)
}
