import type { Point } from './geometry'

/** Converts viewport (client) coordinates to coordinates relative to `container`. */
export function clientToLocal(container: Element, clientX: number, clientY: number): Point {
  const rect = container.getBoundingClientRect()
  return { x: clientX - rect.left, y: clientY - rect.top }
}

/** Center of an element's box, relative to `container`. */
export function elementCenterIn(container: Element, element: Element): Point {
  const rect = element.getBoundingClientRect()
  return clientToLocal(container, rect.left + rect.width / 2, rect.top + rect.height / 2)
}
