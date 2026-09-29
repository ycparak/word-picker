import { ICONS } from '../../components/Icon/icons'

/** Size of the picker cursor in stage units (the same as the toolbar icon). */
const CURSOR_SIZE = 56
/** Browsers ignore cursor images larger than this. */
const MAX_CURSOR_SIZE = 128
const CURSOR_COLOR = 'rgba(40, 40, 40, 0.8)'

/**
 * CSS `cursor` value for the picker tool: the tool's icon, drawn translucent at the current
 * stage scale, with its hotspot on the center dot.
 */
export function pickerCursor(stageScale: number): string {
  const size = Math.min(MAX_CURSOR_SIZE, Math.round(CURSOR_SIZE * stageScale))
  const hotspot = Math.round(size / 2)
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">` +
    `<path fill="${CURSOR_COLOR}" d="${ICONS.filterTiltShift.path}"/></svg>`

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${hotspot} ${hotspot}, crosshair`
}
